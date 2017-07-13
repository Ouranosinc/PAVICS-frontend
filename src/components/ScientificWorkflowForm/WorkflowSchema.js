// Documentation and examples: https://www.crim.ca/confluence/pages/viewpage.action?pageId=13074755
// Specification: http://json-schema.org/
const WorkflowSchema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Workflow",
  "description": "Advanced workflow schema",
  "type": "object",
  "required": ["name"],
  "minProperties": 2,
  "additionalProperties": false,
  "properties": {
    "name": {
      "description": "Workflow name",
      "type": "string"
    },
    "tasks": {
      "description": "Array of workflow task",
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/definitions/workflow_task_schema" }
    },
    "parallel_groups": {
      "description": "Array of group of tasks being executed on multiple processes",
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/definitions/group_of_task_schema" }
    }
  },
  "definitions": {
    "workflow_task_schema": {
      "description": "Describe a WPS process task",
      "type": "object",
      "required": ["name", "provider", "identifier"], // backend: ["name", "url", "identifier"]
      "additionalProperties": false,
      "properties": {
        "name": {
          "description": "Unique name given to each workflow task",
          "type": "string"
        },
        "url": {
          "description": "Url of the WPS provider",
          "type": "string"
        },
        "identifier": {
          "description": "Identifier of a WPS process",
          "type": "string"
        },
        "inputs": {
          "description": "Dictionary of inputs that must be fed to the WPS process",
          "type": "object",
          "minItems": 1,
          "patternProperties": {
            ".*": {
              "oneOf": [
                {
                  "description": "Data that must be fed to this input",
                  "type": "string"
                },
                {
                  "description": "Array of data that must be fed to this input",
                  "type": "array",
                  "minItems": 1,
                  "items": {
                    "type": "string"
                  }
                }
              ]
            }
          }
        },
        "linked_inputs": {
          "description": "Dictionary of dynamic inputs that must be fed to the WPS process and obtained by the output of other tasks",
          "type": "object",
          "minItems": 1,
          "patternProperties": {
            ".*": {
              "oneOf": [
                { "$ref": "#/definitions/input_description_schema" },
                {
                  "description": "Array of input description that must be fed to this input",
                  "type": "array",
                  "minItems": 1,
                  "items": { "$ref": "#/definitions/input_description_schema" }
                }
              ]
            }
          }
        },
        "progress_range": {
          "description": "Progress range to map the whole progress of this task",
          "type": "array",
          "minItems": 2,
          "maxItems": 2,
          "items": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          }
        },
        "provider": {
          "description": "Provider name",
          "type": "string"
        } // frontend only
      }
    },
    "group_of_task_schema" : {
      "type": "object",
      "description": "Describe a group of tasks to be run concurrently",
      "required": ["name", "max_processes", "map", "reduce", "tasks"],
      "additionalProperties": false,
      "properties": {
        "name": {
          "description": "Group of task name",
          "type": "string"
        },
        "max_processes": {
          "description": "Number of processes to run concurrently to process the data",
          "type": "number",
          "minimum": 1
        },
        "map": {
          "oneOf": [
            { "$ref": "#/definitions/input_description_schema" },
            {
              "description": "Array of data that has to be mapped directly",
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string"
              }
            }
          ]
        },
        "reduce": { "$ref": "#/definitions/input_description_schema" },
        "tasks": {
          "description": "Array of workflow task to run concurrently inside the group",
          "type": "array",
          "minItems": 1,
          "items": { "$ref": "#/definitions/workflow_task_schema" }
        }
      }
    },
    "input_description_schema" : {
      "description": "Description of an input source",
      "type": "object",
      "required": ["task"],
      "additionalProperties": false,
      "properties": {
        "task": {
          "description": "Task name",
          "type": "string"
        },
        "output": {
          "description": "Task output name",
          "type": "string"
        },
        "as_reference": {
          "description": "Specify if the task output should be obtained as a reference or not",
          "type": "boolean"
        }
      }
    }
  }
};
export default WorkflowSchema
