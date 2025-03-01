/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  arrayAttributes: require('./array-attributes'),
  arrayOfArrays: require('./array-of-arrays'),
  arrayResponses: require('./array-responses'),
  binarySchemas: require('./binary-schemas'),
  checkMajorVersion: require('./check-major-version'),
  circularRefs: require('./circular-refs'),
  collectionArrayProperty: require('./collection-array-property'),
  consecutivePathSegments: require('./consecutive-path-segments'),
  deleteBody: require('./delete-body'),
  disallowedHeaderParameter: require('./disallowed-header-parameter'),
  discriminatorPropertyExists: require('./discriminator-property-exists'),
  duplicatePathParameter: require('./duplicate-path-parameter'),
  enumCasingConvention: require('./enum-casing-convention'),
  errorResponseSchemas: require('./error-response-schemas'),
  etagHeaderExists: require('./etag-header-exists'),
  inlineSchemas: require('./inline-schemas'),
  mergePatchProperties: require('./merge-patch-properties'),
  operationIdCasingConvention: require('./operationid-casing-convention'),
  operationIdNamingConvention: require('./operationid-naming-convention'),
  operationSummaryExists: require('./operation-summary-exists'),
  optionalRequestBody: require('./optional-request-body'),
  paginationStyle: require('./pagination-style'),
  parameterCasingConvention: require('./parameter-casing-convention'),
  parameterDefault: require('./parameter-default'),
  parameterDescriptionExists: require('./parameter-description-exists'),
  parameterOrder: require('./parameter-order'),
  patchRequestContentType: require('./patch-request-content-type'),
  pathParameterNotCRN: require('./path-parameter-not-crn'),
  pathSegmentCasingConvention: require('./path-segment-casing-convention'),
  preconditionHeader: require('./precondition-header'),
  propertyAttributes: require('./property-attributes'),
  propertyCasingConvention: require('./property-casing-convention'),
  propertyConsistentNameAndType: require('./property-consistent-name-and-type'),
  propertyDescriptionExists: require('./property-description-exists'),
  propertyNameCollision: require('./property-name-collision'),
  refPattern: require('./ref-pattern'),
  refSiblingDuplicateDescription: require('./ref-sibling-duplicate-description'),
  requestBodyNameExists: require('./requestbody-name-exists'),
  requiredProperty: require('./required-property'),
  responseExampleExists: require('./response-example-exists'),
  responseStatusCodes: require('./response-status-codes'),
  schemaDescriptionExists: require('./schema-description-exists'),
  schemaOrContentProvided: require('./schema-or-content-provided'),
  schemaTypeExists: require('./schema-type-exists'),
  schemaTypeFormat: require('./schema-type-format'),
  securitySchemeAttributes: require('./securityscheme-attributes'),
  securitySchemes: require('./securityschemes'),
  stringAttributes: require('./string-attributes'),
  unusedTags: require('./unused-tags'),
  validatePathSegments: require('./valid-path-segments'),
};
