import time
from django.db import connection

class QueryLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_queries = len(connection.queries)
        start_time = time.time()

        response = self.get_response(request)

        duration = time.time() - start_time
        end_queries = len(connection.queries)
        num_queries = end_queries - start_queries
        
        # In Django, connection.queries is a list of dictionaries with 'sql' and 'time' keys
        try:
            db_time = sum(float(q.get('time', 0)) for q in connection.queries[start_queries:end_queries])
        except Exception:
            db_time = 0.0

        print(f"[QueryLog] {request.method} {request.path} - Queries: {num_queries} - DB Time: {db_time:.4f}s - Total Time: {duration:.4f}s")
        return response
