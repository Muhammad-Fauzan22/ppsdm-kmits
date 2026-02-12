import { describe, it, expect, vi } from 'vitest';
import { testDataGenerators, apiTestUtils, mockApiResponses } from './testing-utils';

test('should generate user test data with defaults', () => {
  const user = testDataGenerators.user();
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('role');
  expect(user.email).toContain('@student.its.ac.id');
});

test('should generate user test data with overrides', () => {
  const customEmail = 'test@custom.email';
  const user = testDataGenerators.user({ email: customEmail });
  expect(user.email).toBe(customEmail);
});

test('should generate assessment test data with all dimensions', () => {
  const assessment = testDataGenerators.assessment();
  expect(assessment).toHaveProperty('id');
  expect(assessment).toHaveProperty('userId');
  expect(assessment).toHaveProperty('type');
  expect(assessment).toHaveProperty('dimensions');
  expect(Object.keys(assessment.dimensions)).toHaveLength(9);
});

test('should generate course test data with modules', () => {
  const course = testDataGenerators.course();
  expect(course).toHaveProperty('id');
  expect(course).toHaveProperty('title');
  expect(course).toHaveProperty('modules');
  expect(course.modules).toBeInstanceOf(Array);
  expect(course.modules.length).toBeGreaterThan(0);
});

test('should create successful API response', async () => {
  const data = { message: 'Success' };
  const response = mockApiResponses.success(data);
  
  expect(response.ok).toBe(true);
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual(data);
});

test('should create error API response with custom status', async () => {
  const message = 'Not Found';
  const status = 404;
  const response = mockApiResponses.error(message, status);
  
  expect(response.ok).toBe(false);
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual({ error: message });
});

test('should create mock request with default properties', () => {
  const request = apiTestUtils.createMockRequest();
  expect(request).toHaveProperty('method');
  expect(request).toHaveProperty('url');
  expect(request).toHaveProperty('headers');
});

test('should create mock response with chainable methods', () => {
  const response = apiTestUtils.createMockResponse();
  expect(response).toHaveProperty('status');
  expect(response).toHaveProperty('json');
  expect(response).toHaveProperty('send');
});
