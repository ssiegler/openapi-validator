// Assertation 1: Operations must have unique (name + in combination) parameters.

// Assertation 4:
// Operations must have a non-empty `operationId`

// Assertation 5:
// Operations must have a non-empty `summary` field.

// Assertation 6:
// Arrays MUST NOT be returned as the top-level structure in a response body.
// ref: https://pages.github.ibm.com/CloudEngineering/api_handbook/fundamentals/format.html#object-encapsulation

// Assertation 7:
// All required parameters of an operation are listed before any optional parameters.
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#parameter-order

import pick from "lodash/pick"
import map from "lodash/map"
import each from "lodash/each"
import findIndex from "lodash/findIndex"

export function validate({ resolvedSpec, isOAS3 }, config) {
  const result = {}
  result.error = []
  result.warning = []

  config = config.operations

  map(resolvedSpec.paths, (path, pathKey) => {
      if (pathKey.slice(0,2) === "x-") {
        return
      }
      let pathOps = pick(
        path,
        ["get", "head", "post", "put", "patch", "delete", "options", "trace"]
      )
      each(pathOps, (op, opKey) => {

        if(!op || op["x-sdk-exclude"] === true) {
          return
        }

        // Assertation 1
        each(op.parameters, (param, paramIndex) => {
          let nameAndInComboIndex = findIndex(op.parameters, { "name": param.name, "in": param.in })
          // comparing the current index against the first found index is good, because
          // it cuts down on error quantity when only two parameters are involved,
          // i.e. if param1 and param2 conflict, this will only complain about param2.
          // it also will favor complaining about parameters later in the spec, which
          // makes more sense to the user.
          if(paramIndex !== nameAndInComboIndex) {
            result.error.push({
              path: `paths.${pathKey}.${opKey}.parameters[${paramIndex}]`,
              message: "Operation parameters must have unique 'name' + 'in' properties"
            })
          }
        })

        // Arrays MUST NOT be returned as the top-level structure in a response body.
        let isGetOperation = opKey.toLowerCase() === "get"
        if (isGetOperation) {
          let checkStatus = config.no_array_responses
          if (checkStatus !== "off") {
            each(op.responses, (response, name) => {
              if (isOAS3) {
                each(response.content, (content, contentType) => {
                  if (content.schema && content.schema.type === "array") {
                    result[checkStatus].push({
                      path: `paths.${pathKey}.${opKey}.responses.${name}.content.${contentType}.schema`,
                      message: "Arrays MUST NOT be returned as the top-level structure in a response body."
                    })
                  }
                })
              } else {
                if (response.schema && response.schema.type === "array") {
                  result[checkStatus].push({
                    path: `paths.${pathKey}.${opKey}.responses.${name}.schema`,
                    message: "Arrays MUST NOT be returned as the top-level structure in a response body."
                  })
                }
              }
            })
          }
        }

        let hasOperationId = op.operationId && op.operationId.length > 0 && !!op.operationId.toString().trim()
        if(!hasOperationId) {

          let checkStatus = config.no_operation_id
          if (checkStatus !== "off") {
            result[checkStatus].push({
              path: `paths.${pathKey}.${opKey}.operationId`,
              message: "Operations must have a non-empty `operationId`."
            })
          }
        }

        let hasSummary = op.summary && op.summary.length > 0 && !!op.summary.toString().trim()
        if (!hasSummary) {

          let checkStatus = config.no_summary
          if (checkStatus !== "off") {
            result[checkStatus].push({
              path: `paths.${pathKey}.${opKey}.summary`,
              message: "Operations must have a non-empty `summary` field."
            })
          }
        }

        // this should be good with resolved spec, but double check
        // All required parameters of an operation are listed before any optional parameters.
        let checkStatus = config.parameter_order
        if (checkStatus !== "off") {
          if (op.parameters && op.parameters.length > 0) {
            let firstOptional = -1
            for (let indx = 0; indx < op.parameters.length; indx++) {
              let param = op.parameters[indx]
              if (firstOptional < 0) {
                if (!param.required) {
                  firstOptional = indx
                }
              } else {
                if (param.required) {
                  result[checkStatus].push({
                    path: `paths.${pathKey}.${opKey}.parameters[${indx}]`,
                    message: "Required parameters should appear before optional parameters."
                  })
                }
              }
            }
          }
        }
      })
    })

  return { errors: result.error, warnings: result.warning }
}
