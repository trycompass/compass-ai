declare const PostChatCompletions: {
    readonly body: {
        readonly title: "ChatCompletionsRequest";
        readonly required: readonly ["model", "messages"];
        readonly type: "object";
        readonly properties: {
            readonly model: {
                readonly title: "Model";
                readonly type: "string";
                readonly description: "The name of the model that will complete your prompt. Possible values include `llama-3-sonar-small-32k-chat`, `llama-3-sonar-small-32k-online`, `llama-3-sonar-large-32k-chat`, `llama-3-sonar-large-32k-online`, `llama-3-8b-instruct`, `llama-3-70b-instruct`, and `mixtral-8x7b-instruct`.\n\nDefault: `llama-3-sonar-small-32k-online`";
                readonly enum: readonly ["llama-3-sonar-small-32k-chat", "llama-3-sonar-small-32k-online", "llama-3-sonar-large-32k-chat", "llama-3-sonar-large-32k-online", "llama-3-8b-instruct", "llama-3-70b-instruct", "mixtral-8x7b-instruct"];
                readonly default: "llama-3-sonar-small-32k-online";
            };
            readonly messages: {
                readonly title: "Messages";
                readonly type: "array";
                readonly description: "A list of messages comprising the conversation so far.";
                readonly items: {
                    readonly title: "Message";
                    readonly type: "object";
                    readonly required: readonly ["content", "role"];
                    readonly properties: {
                        readonly content: {
                            readonly title: "Message Content";
                            readonly type: "string";
                            readonly description: "The contents of the message in this turn of conversation.";
                        };
                        readonly role: {
                            readonly title: "Role";
                            readonly type: "string";
                            readonly description: "The role of the speaker in this turn of conversation. After the (optional) system message, user and assistant roles should alternate with `user` then `assistant`, ending in `user`.";
                            readonly enum: readonly ["system", "user", "assistant"];
                        };
                    };
                };
                readonly default: readonly [{
                    readonly role: "system";
                    readonly content: "Be precise and concise.";
                }, {
                    readonly role: "user";
                    readonly content: "How many stars are there in our galaxy?";
                }];
            };
            readonly max_tokens: {
                readonly title: "Max Tokens";
                readonly type: "integer";
                readonly description: "The maximum number of completion tokens returned by the API. The total number of tokens requested in max_tokens plus the number of prompt tokens sent in messages must not exceed the context window token limit of model requested. If left unspecified, then the model will generate tokens until either it reaches its stop token or the end of its context window.";
            };
            readonly temperature: {
                readonly title: "Temperature";
                readonly type: "number";
                readonly default: 0.2;
                readonly description: "The amount of randomness in the response, valued between 0 inclusive and 2 exclusive. Higher values are more random, and lower values are more deterministic.";
                readonly minimum: 0;
                readonly maximum: 2;
                readonly exclusiveMaximum: true;
            };
            readonly top_p: {
                readonly title: "Top P";
                readonly type: "number";
                readonly default: 0.9;
                readonly description: "The nucleus sampling threshold, valued between 0 and 1 inclusive. For each subsequent token, the model considers the results of the tokens with top_p probability mass. We recommend either altering top_k or top_p, but not both.";
                readonly minimum: 0;
                readonly maximum: 1;
            };
            readonly return_citations: {
                readonly title: "Return Citations";
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Determines whether or not a request to an online model should return citations. Citations are in closed beta access. To gain access, apply at https://perplexity.typeform.com/to/j50rnNiB";
            };
            readonly return_images: {
                readonly title: "Return Images";
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Determines whether or not a request to an online model should return images. Images are in closed beta access. To gain access, apply at https://perplexity.typeform.com/to/j50rnNiB";
            };
            readonly top_k: {
                readonly title: "Top K";
                readonly type: "number";
                readonly default: 0;
                readonly description: "The number of tokens to keep for highest top-k filtering, specified as an integer between 0 and 2048 inclusive. If set to 0, top-k filtering is disabled. We recommend either altering top_k or top_p, but not both.";
                readonly minimum: 0;
                readonly maximum: 2048;
            };
            readonly stream: {
                readonly title: "Streaming";
                readonly type: "boolean";
                readonly default: false;
                readonly description: "Determines whether or not to incrementally stream the response with [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format) with `content-type: text/event-stream`.";
            };
            readonly presence_penalty: {
                readonly title: "Presence Penalty";
                readonly type: "number";
                readonly default: 0;
                readonly description: "A value between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. Incompatible with `frequency_penalty`.";
                readonly minimum: -2;
                readonly maximum: 2;
            };
            readonly frequency_penalty: {
                readonly title: "Frequency Penalty";
                readonly type: "number";
                readonly default: 1;
                readonly description: "A multiplicative penalty greater than 0. Values greater than 1.0 penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. A value of 1.0 means no penalty. Incompatible with `presence_penalty`.";
                readonly minimum: 0;
                readonly exclusiveMinimum: true;
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "application/json (`stream = false`)";
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly title: "Response ID";
                    readonly type: "string";
                    readonly format: "uuid";
                    readonly description: "An ID generated uniquely for each response.";
                };
                readonly model: {
                    readonly title: "Model";
                    readonly type: "string";
                    readonly description: "The model used to generate the response.";
                };
                readonly object: {
                    readonly title: "Object Type";
                    readonly type: "string";
                    readonly description: "The object type, which always equals `chat.completion`.";
                };
                readonly created: {
                    readonly title: "Created Timestamp";
                    readonly type: "integer";
                    readonly description: "The Unix timestamp (in seconds) of when the completion was created.";
                };
                readonly choices: {
                    readonly title: "Choices";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "Choice";
                        readonly type: "object";
                        readonly properties: {
                            readonly index: {
                                readonly type: "integer";
                            };
                            readonly finish_reason: {
                                readonly title: "Finish Reason";
                                readonly type: "string";
                                readonly description: "The reason the model stopped generating tokens. Possible values include `stop` if the model hit a natural stopping point, or `length` if the maximum number of tokens specified in the request was reached.\n\n`stop` `length`";
                                readonly enum: readonly ["stop", "length"];
                            };
                            readonly message: {
                                readonly title: "Message";
                                readonly type: "object";
                                readonly required: readonly ["content", "role"];
                                readonly properties: {
                                    readonly content: {
                                        readonly title: "Message Content";
                                        readonly type: "string";
                                        readonly description: "The contents of the message in this turn of conversation.";
                                    };
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                        readonly description: "The role of the speaker in this turn of conversation. After the (optional) system message, user and assistant roles should alternate with `user` then `assistant`, ending in `user`.\n\n`system` `user` `assistant`";
                                        readonly enum: readonly ["system", "user", "assistant"];
                                    };
                                };
                                readonly description: "The message generated by the model.";
                            };
                            readonly delta: {
                                readonly title: "Message";
                                readonly type: "object";
                                readonly required: readonly ["content", "role"];
                                readonly properties: {
                                    readonly content: {
                                        readonly title: "Message Content";
                                        readonly type: "string";
                                        readonly description: "The contents of the message in this turn of conversation.";
                                    };
                                    readonly role: {
                                        readonly title: "Role";
                                        readonly type: "string";
                                        readonly description: "The role of the speaker in this turn of conversation. After the (optional) system message, user and assistant roles should alternate with `user` then `assistant`, ending in `user`.\n\n`system` `user` `assistant`";
                                        readonly enum: readonly ["system", "user", "assistant"];
                                    };
                                };
                                readonly description: "The incrementally streamed next tokens. Only meaningful when `stream = true`.";
                            };
                        };
                    };
                    readonly description: "The list of completion choices the model generated for the input prompt.";
                };
                readonly usage: {
                    readonly title: "Usage Statistics";
                    readonly description: "Usage statistics for the completion request.";
                    readonly type: "object";
                    readonly properties: {
                        readonly prompt_tokens: {
                            readonly title: "Prompt Tokens";
                            readonly description: "The number of tokens provided in the request prompt.";
                            readonly type: "integer";
                        };
                        readonly completion_tokens: {
                            readonly title: "Completion Tokens";
                            readonly description: "The number of tokens generated in the response output.";
                            readonly type: "integer";
                        };
                        readonly total_tokens: {
                            readonly title: "Total Tokens";
                            readonly description: "The total number of tokens used in the chat completion (prompt + completion).";
                            readonly type: "integer";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "422": {
            readonly title: "HTTPValidationError";
            readonly type: "object";
            readonly properties: {
                readonly detail: {
                    readonly title: "Detail";
                    readonly type: "array";
                    readonly items: {
                        readonly title: "ValidationError";
                        readonly required: readonly ["loc", "msg", "type"];
                        readonly type: "object";
                        readonly properties: {
                            readonly loc: {
                                readonly title: "Location";
                                readonly type: "array";
                                readonly items: {
                                    readonly anyOf: readonly [{
                                        readonly type: "string";
                                    }, {
                                        readonly type: "integer";
                                    }];
                                };
                            };
                            readonly msg: {
                                readonly title: "Message";
                                readonly type: "string";
                            };
                            readonly type: {
                                readonly title: "Error Type";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { PostChatCompletions };
