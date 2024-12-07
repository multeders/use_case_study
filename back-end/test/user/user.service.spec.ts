import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import { User } from '../../src/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;

  const mockUser = {
    id: 1,
    username: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    phone: '1234567890',
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    mockRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.findByEmail('john.doe@example.com');
    expect(result).toEqual(mockUser);
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
  });

  it('should create a new user with hashed password', async () => {
    const input = {
      username: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'plaintextpassword',
      phone: '9876543210',
    };

    const hashedPassword = 'hashedpassword';
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

    mockRepository.findOne.mockResolvedValue(null); // No user with the email exists
    mockRepository.create.mockReturnValue({ ...input, password: hashedPassword });
    mockRepository.save.mockResolvedValue({ ...input, id: 2, password: hashedPassword });

    const result = await service.createUser(
      input.username,
      input.email,
      input.password,
      input.phone,
    );

    expect(result).toEqual({ ...input, id: 2, password: hashedPassword });
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'jane.doe@example.com' } });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
  });
});
