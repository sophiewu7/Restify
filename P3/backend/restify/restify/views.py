from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def index(request):
    return Response("Book unique homes, vacation rentals, and more on Restify")
