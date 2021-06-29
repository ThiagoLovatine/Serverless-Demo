const AWS = require("aws-sdk");
const UUID = require("uuid");
const Joi = require("joi");

const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

const validateRequest = async (params) => {
  const schema = Joi.object({
    title: Joi.string().min(10).required(),
    published: Joi.boolean().required(),
  });

  return schema.validateAsync(params);
};

module.exports.jobUpdate = async (evt, ctx) => {
  let data = {};
  const id = String(evt.pathParameters.id);

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
    TableName: "JobsDBTable",
    UpdateExpression: "SET title=:title, published=:published, updatedAt=:updatedAt",
    ExpressionAttributeValues: {
        ':title': data.title,
        ':published': data.published,
        ':updatedAt': timestamp,
    },
    ReturnValues: 'ALL_NEW',
    Key: {
        id
    }
  };

  let statusCode = 200;
  let body;

  try {
    const newJobResponse = await DynamoDB.update(newJobParams).promise();
    body = JSON.stringify(newJobResponse);
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
