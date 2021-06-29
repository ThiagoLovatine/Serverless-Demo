const AWS = require("aws-sdk");
const UUID = require("uuid");
const Joi = require("joi");

const options = process.env.IS_OFFLINE ? { region: "localhost", endpoint: "http://localhost:8000" } : {}
const DynamoDB = new AWS.DynamoDB.DocumentClient(options);

const validateRequest = async (params) => {
  const schema = Joi.object({
    title: Joi.string().min(10).required(),
    published: Joi.boolean().required(),
  });

  return schema.validateAsync(params);
};

module.exports.jobCreate = async (evt, ctx) => {
  let data = {};

  try {
     data = await validateRequest(JSON.parse(evt.body));
  } catch (err) {
    return {
      statusCode: 403,
      body: JSON.stringify(err),
    };
  }

  const timestamp = new Date().getTime();

  const newJobParams = {
    TableName: process.env.TABLE_JOBS,
    Item: {
      id: UUID.v1(),
      title: data.title,
      published: data.published,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  let statusCode = 200;
  let body;

  try {
    const newJobResponse = await DynamoDB.put(newJobParams).promise();
    body = JSON.stringify(newJobParams.Item);
  } catch (err) {
    statusCode = 500;
    body = JSON.stringify(err);
    console.log("Err: ", err);
  }

  return {
    statusCode,
    body,
  };
};
