const AWS = require("aws-sdk");
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
    TableName: process.env.TABLE_JOBS,
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
