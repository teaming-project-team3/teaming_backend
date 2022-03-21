import { LoginCheckMiddleware } from './log.middleware';

describe('LoginCheckMiddleware', () => {
  it('should be defined', () => {
    expect(new LoginCheckMiddleware()).toBeDefined();
  });
});
