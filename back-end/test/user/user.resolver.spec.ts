import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../../src/user/user.resolver';
import { UserService } from '../../src/user/user.service';
import { User } from '../../src/user/user.entity';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: UserService;

  const mockUser = {
    id: 1,
    username: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    phone: '1234567890',
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return a user by email', async () => {
    mockUserService.findByEmail.mockResolvedValue(mockUser);

    const result = await resolver.user('john.doe@example.com');
    expect(result).toEqual(mockUser);
    expect(mockUserService.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
  });

  it('should register a new user', async () => {
    const input = {
      username: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'plaintextpassword',
      phone: '9876543210',
    };

    const expectedUser = { ...input, id: 2, password: 'hashedpassword' };
    mockUserService.createUser.mockResolvedValue(expectedUser);

    const result = await resolver.register(
      input.username,
      input.email,
      input.password,
      input.phone,
    );
    expect(result).toEqual(expectedUser);
    expect(mockUserService.createUser).toHaveBeenCalledWith(
      input.username,
      input.email,
      input.password,
      input.phone,
    );
  });
});
