const request = require('supertest');
const express = require('express');
const app = require('../app'); // Ensure your app is exported from server.js/app.js

describe('GET Endpoints', () => {
  it('should return all contacts', async () => {
    const res = await request(app).get('/contacts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return all projects', async () => {
    const res = await request(app).get('/projects');
    expect(res.statusCode).toEqual(200);
  });

  it('should return 404 for a non-existent contact ID', async () => {
    const res = await request(app).get('/contacts/123456789012345678901234');
    expect(res.statusCode).toEqual(404);
  });

  it('should load the API documentation page', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.statusCode).toEqual(200);
  });
});