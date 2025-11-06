import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { ApiResponse } from "../interfaces/api-response.interface";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(
        (data: T): ApiResponse<T> => ({
          success: true,
          message:
            data && typeof data === "object" && "message" in data
              ? (data.message as string)
              : "Request successful",
          data: data && typeof data === "object" && "data" in data ? (data.data as T) : data,
        }),
      ),
    );
  }
}
