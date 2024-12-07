import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from '../../src/task/task.resolver';
import { TaskService } from '../../src/task/task.service';
import { UserService } from '../../src/user/user.service';
import { AuthGuard } from '../../src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Task } from '../../src/task/task.entity';

describe('TaskResolver', () => {
  let resolver: TaskResolver;
  let mockTaskService: Partial<TaskService>;
  let mockUserService: Partial<UserService>;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'A task for testing',
    status: 'pending',
    user: { id: 1 },
  };

  const mockJwtService = {
    verify: jest.fn(() => ({ sub: 1 })), // Simulate valid token payload
  };

  beforeEach(async () => {
    mockTaskService = {
      findAll: jest.fn(),
      createTask: jest.fn(),
      editTask: jest.fn(),
      deleteTask: jest.fn(),
      sendNotification: jest.fn(),
    };

    mockUserService = {
      findNotifiedUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService, // Mock JwtService
        },
      ],
    })
      .overrideGuard(AuthGuard) // Mock AuthGuard to allow testing
      .useValue({
        canActivate: jest.fn(() => true), // Allow all requests in tests
      })
      .compile();

    resolver = module.get<TaskResolver>(TaskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return all tasks for a user', async () => {
    (mockTaskService.findAll as jest.Mock).mockResolvedValue([mockTask]);

    const tasks = await resolver.tasks({ user: { sub: 1 } });
    expect(tasks).toEqual([mockTask]);
  });

  it('should create a task and send notifications', async () => {
    const notifiedUsers = [{ email: 'notify@example.com', phone: '1234567890' }];
    (mockUserService.findNotifiedUsers as jest.Mock).mockResolvedValue(notifiedUsers);
    (mockTaskService.createTask as jest.Mock).mockResolvedValue(mockTask);

    const task = await resolver.createTask('New Task', 'Description', 'pending', {
      user: { sub: 1 },
    });
    expect(task).toEqual(mockTask);
  });

  it('should edit a task', async () => {
    (mockTaskService.editTask as jest.Mock).mockResolvedValue(mockTask);

    const result = await resolver.editTask(1, { user: { sub: 1 } }, 'Updated Task', null, null);
    expect(result).toEqual(mockTask);
  });

  it('should delete a task', async () => {
    (mockTaskService.deleteTask as jest.Mock).mockResolvedValue(true);

    const result = await resolver.deleteTask(1, { user: { sub: 1 } });
    expect(result).toBe(true);
  });
});
