<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SetBearerTokenFromQuery
{
    /**
     * If request has a query param 'token' and no Authorization header,
     * set the Authorization header to 'Bearer <token>'.
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->has('token') && !$request->headers->has('Authorization')) {
            $token = $request->query('token');
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}

