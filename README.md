# uw-lib-auth.js

A node.js module providing universal auth implementation for use in utilitywarehouse service implementation.

## OAuth2 + JWT

This handler applies if a `Authorization: Bearer <token>` header is present. JWT verification is implemented using a private/public key pair where private part is held secretly by issuing server (uw-service-shepherd) and public key is issued to implementing services.

## Extending with your own handlers

The module exposes an 'abstract' class `module.Method.Method` that your handler needs to be extending. You are required to implement following methods:

- `applies(headers hash) : bool` - a synchronous function accepting a hash of request headers (all lowercase) that returns true if the correct header is present
- `execute(headers hash, callback fn(err, result)) : void` - an asynchronous function accepting a hash of request headers and a result callback, any result out of the auth process can be passed in the callback and will be attached to reques

## Future planned handlers

- uw-auth/oauth2-plain - a handler to allow auth if a gateway proxy already verified a token (traefic for example)

## Todo

An interface to return supported auth method via `WWW-Authenticate` header. Currently only `uw-auth/oauth2-jwt` is supported.
