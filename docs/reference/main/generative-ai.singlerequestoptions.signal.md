<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@google/generative-ai](./generative-ai.md) &gt; [SingleRequestOptions](./generative-ai.singlerequestoptions.md) &gt; [signal](./generative-ai.singlerequestoptions.signal.md)

## SingleRequestOptions.signal property

An object that may be used to abort asynchronous requests. The request may also be aborted due to the expiration of the timeout value, if provided.

NOTE: AbortSignal is a client-only operation. Using it to cancel an operation will not cancel the request in the service. You will still be charged usage for any applicable operations.

**Signature:**

```typescript
signal?: AbortSignal;
```
