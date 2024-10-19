import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync, readFile } from 'fs';

// import { Buffer } from 'node:buffer';
// import fsPromises from 'fs/promises';

jest.mock('path', () => ({
  join: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFile: jest.fn(),
}));

// jest.mock('path', () => ({
//   ...jest.requireActual('path'),
//   join: jest.fn(),
// }));

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setTimeout = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    // cal setTimout 1 time
    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeout);
    // cal setTimout with right arguments
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout - 1);
    //move time too 999 (1000-1) to check callback is not called while setTimout is not finished

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(1);
    // move time (999+1) to check callbacj is called
    expect(callback).toBeCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    const interval = 2000;
    const setInterval = jest.spyOn(global, 'setInterval');
    // create spy to check if setInterval will be called

    doStuffByInterval(callback, interval);

    expect(setInterval).toHaveBeenCalledTimes(1);
    // надо ли

    expect(setInterval).toHaveBeenLastCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 2000;

    doStuffByInterval(callback, interval);

    expect(callback).not.toBeCalled();
    // check if callback is not calles before finiish interval

    jest.advanceTimersByTime(interval);
    // move interval to 2000 s
    expect(callback).toHaveBeenCalledTimes(1);
    // check if callback is called 1 tome

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);
    // e.t.c

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  jest.clearAllMocks();
  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';
    const mockFullPath = '/path/to/test.txt';
    (join as jest.Mock).mockReturnValue(mockFullPath);
    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(expect.anything(), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'test.txt';
    mockExistsSync.mockReturnValue(false);
    // if file doesn't exist

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(mockReadFile).not.toBeCalled();
  });

  test('should return file content if file exists', async () => {
    // Write your test here
  });
});
