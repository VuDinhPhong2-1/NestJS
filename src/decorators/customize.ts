import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';

// decorator cho phép ko kiểm tra phân quyền
export const IS_PUBLIC_KEY = 'isPublic';
// Khi decor Public() đặt ở route nestjs sẽ check 
// xem IS_PUBLIC_KEY có bằng true ko? nếu bằng true => ko cần phân quyền, ngược lại bằng false
// SetMetadata(IS_PUBLIC_KEY, true) IS_PUBLIC_KEY đã được set = true ở decor Public
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


export const RESPONSE_MESSAGE = 'response_message'
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);

// Trả về req.user
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);