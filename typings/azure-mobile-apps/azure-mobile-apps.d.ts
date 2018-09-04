// Type definitions for azure-mobile-apps v2.1.7
// Project: https://github.com/Azure/azure-mobile-apps-node/
// Definitions by: Microsoft Azure <https://github.com/Azure/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="express" />
/// <reference types="azure-sb" />
import { Request, Response, RequestHandler, ErrorRequestHandler } from 'express'
import { NotificationHubService } from "azure-sb";

//export namespace AzureMobileApps {
// export function (configuration?: Azure.MobileApps.Configuration): Azure.MobileApps.Platforms.Express.MobileApp;
export function table(): Azure.MobileApps.Platforms.Express.Table;
export function api(definition?: Azure.MobileApps.ApiDefinition): Azure.MobileApps.ApiDefinition;
export const logger: Azure.MobileApps.Logger;
export const query: Azure.MobileApps.Query;


// var out: AzureMobileApps;
// export = out;
//}
// declare module "azure-mobile-apps/src/logger" {
//     var logger: Azure.MobileApps.Logger;
//     export = logger;
// }

// declare module "azure-mobile-apps/src/query" {
//     var query: Azure.MobileApps.Query;
//     export = query;
// }

declare namespace Azure.MobileApps {
    // the additional Platforms namespace is required to avoid collisions with the main Express namespace
    export module Platforms {
        export module Express {
            interface MobileApp extends Middleware {
                configuration: Configuration;
                tables: Tables;
                table(): Table;
                api: Api;
                use(...middleware: Middleware[]): MobileApp;
                use(middleware: Middleware[]): MobileApp;
            }

            interface Api {
                add(name: string, definition: ApiDefinition): void;
                import(fileOrFolder: string): void;
            }

            interface Table extends TableDefinition {
                use(...middleware: (Middleware | ErrorRequestHandler)[]): Table;
                use(middleware: (Middleware | ErrorRequestHandler)[]): Table;
                read: TableOperation;
                update: TableOperation;
                insert: TableOperation;
                delete: TableOperation;
                undelete: TableOperation;
                operation: Middleware;
            }

            interface TableOperation {
                (operationHandler: (context: Context) => void): Table;
                use(...middleware: (Middleware | ErrorRequestHandler)[]): Table;
                use(middleware: (Middleware | ErrorRequestHandler)[]): Table;
                access?: AccessType;
            }

            interface Tables {
                configuration: Configuration;
                add(name: string, definition?: Table | TableDefinition): void;
                import(fileOrFolder: string): void;
                initialize(): Thenable<any>;
            }
        }
    }

    export module Data {
        interface Table {
            // I DONT KNOW ABOUT THIS -------------------START
            includeTotalCount(): Table;
            includeDeleted(): Table;
            orderBy(properties: string): Table;
            orderByDescending(properties: string): Table;
            select(...properties: string[]): Table;
            select(properties: string): Table;
            skip(count: number): Table;
            take(count: number): Table;
            where(filter: any): Table;
            where(filterFunc: Function, ...params: (string | number | Date)[]): Table;
            // I DONT KNOW ABOUT THIS -------------------END
            read(query?: QueryJs): Promise<any[]>;
            update(item: any, query?: QueryJs): Promise<any>;
            insert(item: any): Promise<any>;
            delete(query: QueryJs | any, version?: string): Promise<any>;
            undelete(query: QueryJs | any, version?: string): Promise<any>;
            truncate(): Promise<void>;
            initialize(): Promise<void>;
            schema(): Promise<Column[]>;
        }

        interface Column {
            name: string;
            type: string;
        }
    }

    // auth
    interface User {
        id: string;
        claims: any[] | any;
        token: string;
        getIdentity(provider: string): Thenable<any>;
    }

    interface Auth {
        validate(token: string): Thenable<User>;
        decode(token: string): User;
        sign(payload: any): string;
    }

    // configuration
    interface Configuration {
        platform?: string;
        basePath?: string;
        configFile?: string;
        promiseConstructor?: (resolve: (result: any) => void, reject: (error: any) => void) => Thenable<any>;
        apiRootPath?: string;
        tableRootPath?: string;
        notificationRootPath?: string;
        swaggerPath?: string;
        authStubRoute?: string;
        debug?: boolean;
        version?: string;
        apiVersion?: string;
        homePage?: boolean;
        swagger?: boolean;
        maxTop?: number;
        pageSize?: number;
        logging?: Configuration.Logging;
        data?: Configuration.Data;
        auth?: Configuration.Auth;
        cors?: Configuration.Cors;
        notifications?: Configuration.Notifications;
        webhook?: Webhook;
    }

    export module Configuration {
        // it would be nice to have the config for various providers in separate interfaces,
        // but this is the simplest solution to support variations of the current setup
        interface Data {
            provider: string;
            user?: string;
            password?: string;
            server?: string;
            port?: number;
            database?: string;
            connectionTimeout?: string;
            options?: { encrypt: boolean };
            schema?: string;
            dynamicSchema?: boolean;
            filename?: string;
        }

        interface Auth {
            secret: string;
            validateTokens?: boolean;
        }

        interface Logging {
            level?: string;
            transports?: LoggingTransport[];
        }

        interface LoggingTransport { }

        interface Cors {
            exposeHeaders: string;
            maxAge?: number;
            hostnames: string[];
        }

        interface Notifications {
            hubName: string;
            connectionString?: string;
            endpoint?: string;
            sharedAccessKeyName?: string;
            sharedAccessKeyValue?: string;
        }
    }

    // query
    interface Query {
        create(tableName: string): QueryJs;
        fromRequest(req: Express.IRequest): QueryJs;
        toOData(query: QueryJs): OData;
    }

    interface QueryJs {
        includeTotalCount(): QueryJs;
        includeDeleted(): QueryJs;
        orderBy(properties: string): QueryJs;
        orderByDescending(properties: string): QueryJs;
        select(...properties: string[]): QueryJs;
        select(properties: string): QueryJs;
        skip(count: number): QueryJs;
        take(count: number): QueryJs;
        where(filter: any): QueryJs;
        where(filterFunc: Function, ...params: (string | number | Date)[]): QueryJs;
        // these are properties added by the SDK
        id?: string | number;
        single?: boolean;
    }

    interface OData {
        table: string;
        filters?: string;
        ordering?: string;
        orderClauses?: string;
        skip?: number;
        take?: number;
        selections?: string;
        includeTotalCount?: boolean;
    }

    // general
    var nh: NotificationHubService;

    interface Context {
        query: QueryJs;
        id: string;
        item: any;
        req: Express.IRequest;
        res: Express.IResponse;
        data: ContextData;
        configuration: Configuration;
        tables: (tableName: string) => Data.Table;
        user: User;
        push: typeof nh;
        logger: Logger;
        execute(): Promise<any>;
        next(error: string | Error): any;
    }

    interface ContextData {
        (table: TableDefinition): Data.Table;
        execute(q: SqlQueryDefinition): Promise<any>;
    }

    interface SqlQueryDefinition {
        sql: string;
        parameters?: SqlParameterDefinition[];
    }

    interface SqlParameterDefinition {
        name: string;
        value: any;
    }

    interface TableDefinition {
        access?: AccessType;
        authorize?: boolean;
        autoIncrement?: boolean;
        columns?: any;
        databaseTableName?: string;
        dynamicSchema?: boolean;
        maxTop?: number;
        name?: string;
        pageSize?: number;
        schema?: string;
        softDelete?: boolean;
        userIdColumn?: string;

        filters?: [(query: QueryJs, context: Context) => void | QueryJs];
        transforms?: [(item: any, context: Context) => void | any];
        hooks?: [(results: any, context: Context) => void];

        perUser?: boolean;
        recordsExpire?: Duration;
        webhook?: Webhook | boolean;
        seed?: Array<any>;
    }

    type AccessType = 'anonymous' | 'authenticated' | 'disabled';

    interface Duration {
        milliseconds?: number;
        seconds?: number;
        minutes?: number;
        hours?: number;
        days?: number;
        weeks?: number;
        months?: number;
        years?: number;
    }

    interface Webhook {
        url: string;
    }

    interface ApiDefinition {
        authorize?: boolean;
        get?: Middleware | Middleware[];
        post?: Middleware | Middleware[];
        patch?: Middleware | Middleware[];
        put?: Middleware | Middleware[];
        delete?: Middleware | Middleware[];
    }

    interface Thenable<R> {
        then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
        then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
        catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
        catch<U>(onRejected?: (error: any) => void): Thenable<U>;
    }

    interface Logger {
        log(level: string, ...message: any[]): void;
        silly(...message: any[]): void;
        debug(...message: any[]): void;
        verbose(...message: any[]): void;
        info(...message: any[]): void;
        warn(...message: any[]): void;
        error(...message: any[]): void;
    }

    interface Middleware {
        (req: Express.IRequest, res: Express.IResponse, next: NextMiddleware): void;
    }

    interface NextMiddleware {
        (error?: any): void;
    }
}

// additions to the Express modules
declare namespace Express {
    interface IRequest extends Request {
        azureMobile: Azure.MobileApps.Context
    }

    interface IResponse extends Response {
        results?: any;
    }
}
