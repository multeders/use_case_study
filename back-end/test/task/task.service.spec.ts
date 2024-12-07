import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../../src/task/task.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../../src/task/task.entity';
import { RabbitMQService } from '../../src/common/rabbitmq.service';

describe('TaskService', () => {
  let service: TaskService;
  let mockRepository: Partial<Repository<Task>>;
  let mockRabbitMQService: Partial<RabbitMQService>;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'A task for testing',
    status: 'pending',
    user: { id: 1 },
  };

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockRabbitMQService = {
      sendToQueue: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all tasks for a user', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([mockTask]);

    const tasks = await service.findAll(1);
    expect(tasks).toEqual([mockTask]);
    expect(mockRepository.find).toHaveBeenCalledWith({ where: { user: { id: 1 } } });
  });

  it('should create a task', async () => {
    const newTask = { ...mockTask, id: 2 };
    (mockRepository.create as jest.Mock).mockReturnValue(newTask);
    (mockRepository.save as jest.Mock).mockResolvedValue(newTask);

    const task = await service.createTask('New Task', 'Description', 'pending', 1);
    expect(task).toEqual(newTask);
  });

  it('should edit a task', async () => {
    const updatedTask = { ...mockTask, title: 'Updated Task' };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(mockTask);
    (mockRepository.save as jest.Mock).mockResolvedValue(updatedTask);

    const result = await service.editTask(1, { title: 'Updated Task' }, 1);
    expect(result).toEqual(updatedTask);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, user: { id: 1 } } });
    expect(mockRepository.save).toHaveBeenCalledWith(updatedTask);
  });

  it('should delete a task', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(mockTask);
    (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

    const result = await service.deleteTask(1, 1);
    expect(result).toBe(true);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, user: { id: 1 } } });
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should send a notification', async () => {
    await service.sendNotification('test@example.com', '1234567890', 'Test message');
    expect(mockRabbitMQService.sendToQueue).toHaveBeenCalledWith('notifications', {
      email: 'test@example.com',
      phone: '1234567890',
      message: 'Test message',
    });
  });
});
