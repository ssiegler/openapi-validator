/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { requiredPropertyMissing } = require('../src/rules');
const { makeCopy, rootDocument, testRule, severityCodes } = require('./utils');

const ruleId = 'ibm-define-required-properties';
const rule = requiredPropertyMissing;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error with properly defined allOf, anyOf, and oneOf schemas', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['foo'],
                anyOf: [
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                      },
                      bar: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                      },
                      baz: {
                        type: 'string',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        baz: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error if not schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  not: {
                    type: 'object',
                    required: ['foo'],
                    properties: {
                      baz: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error if allOf schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  allOf: [
                    // an allOf needs at least one subschema with the required property
                    {
                      type: 'object',
                      properties: {
                        baz: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in at least one of the allOf schemas: foo'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      'v1/books',
      'post',
      'parameters',
      '0',
      'content',
      'application/json',
      'schema',
    ]);
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if anyOf schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['foo'],
                anyOf: [
                  // an anyOf needs all subschemas to define the required property
                  {
                    type: 'object',
                    properties: {
                      foo: {
                        type: 'string',
                      },
                      bar: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    properties: {
                      baz: {
                        type: 'string',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in all of the anyOf/oneOf schemas: foo'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      'v1/books',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
    ]);
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error if oneOf schema is missing a required property', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  oneOf: [
                    // a oneOf needs all subschemas to define the required property
                    {
                      type: 'object',
                      properties: {
                        foo: {
                          type: 'string',
                        },
                        bar: {
                          type: 'string',
                        },
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        baz: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Required property must be defined in all of the anyOf/oneOf schemas: foo'
    );
    expect(validation.path).toStrictEqual([
      'paths',
      'v1/books',
      'post',
      'responses',
      '201',
      'content',
      'application/json',
      'schema',
    ]);
    expect(validation.severity).toBe(severityCodes.error);
  });

  it('should error for schemas that are missing definitions for required properties', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['v1/books'] = {
      post: {
        parameters: [
          {
            name: 'metadata',
            in: 'header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  properties: {},
                },
              },
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['foo'],
                properties: {},
              },
            },
          },
        },
        responses: {
          201: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['foo'],
                  properties: {},
                },
              },
            },
          },
        },
      },
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(3);

    results.forEach(r => {
      expect(r.code).toBe(ruleId);
      expect(r.message).toBe(
        'Required property must be defined in the schema: foo'
      );
      expect(r.severity).toBe(severityCodes.error);
    });

    expect(results[0].path).toStrictEqual([
      'paths',
      'v1/books',
      'post',
      'parameters',
      '0',
      'content',
      'application/json',
      'schema',
    ]);

    expect(results[1].path).toStrictEqual([
      'paths',
      'v1/books',
      'post',
      'requestBody',
      'content',
      'application/json',
      'schema',
    ]);

    expect(results[2].path).toStrictEqual([
      'paths',
      'v1/books',
      'post',
      'responses',
      '201',
      'content',
      'application/json',
      'schema',
    ]);
  });
});
