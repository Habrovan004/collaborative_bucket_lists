from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Bucket
from .serializers import BucketSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def bucket_list_create(request):
    if request.method == 'GET':
        buckets = Bucket.objects.all()
        serializer = BucketSerializer(buckets, many=True, context={'request': request})
        return Response({
            "count": len(serializer.data),
            "results": serializer.data
        })

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=401)

        serializer = BucketSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def bucket_detail(request, pk):
    bucket = get_object_or_404(Bucket, pk=pk)
    serializer_context = {'request': request}

    if request.method == 'GET':
        serializer = BucketSerializer(bucket, context=serializer_context)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        if bucket.owner != request.user:
            return Response({"detail": "Only owner can edit."}, status=403)

        serializer = BucketSerializer(bucket, data=request.data, partial=True, context=serializer_context)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        if bucket.owner != request.user:
            return Response({"detail": "Only owner can delete."}, status=403)
        bucket.delete()
        return Response(status=204)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_complete(request, pk):
    bucket = get_object_or_404(Bucket, pk=pk)
    if bucket.owner != request.user:
        return Response({"detail": "Not your bucket."}, status=403)

    bucket.is_completed = not bucket.is_completed
    bucket.save()
    return Response({
        "id": bucket.id, # type: ignore
        "is_completed": bucket.is_completed,
        "status": bucket.status
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upvote_bucket(request, pk):
    bucket = get_object_or_404(Bucket, pk=pk)
    user = request.user

    if user in bucket.upvotes.all():
        bucket.upvotes.remove(user)
        action = "removed"
    else:
        bucket.upvotes.add(user)
        action = "added"

    return Response({
        "id": bucket.id, # type: ignore
        "upvotes_count": bucket.upvotes_count,
        "action": action
    })