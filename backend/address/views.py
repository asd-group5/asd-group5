from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AddAddressView(APIView):
    def post(self, request):
        # 주소 추가 로직
        # 요청 데이터에서 주소 정보 가져오기
        # 주소를 데이터베이스에 저장
        return Response({'message': 'Address added successfully'}, status=status.HTTP_201_CREATED)

class EditAddressView(APIView):
    def put(self, request, address_id):
        # 주소 수정 로직
        return Response({'message': 'Address updated successfully'}, status=status.HTTP_200_OK)

class DeleteAddressView(APIView):
    def delete(self, request, address_id):
        # 주소 삭제 로직
        return Response({'message': 'Address deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class ListAddressesView(APIView):
    def get(self, request):
        # 저장된 주소 목록 가져오기
        return Response({'addresses': []}, status=status.HTTP_200_OK)

class SetDefaultAddressView(APIView):
    def post(self, request, address_id):
        # 기본 주소 설정 로직
        return Response({'message': 'Default address set successfully'}, status=status.HTTP_200_OK)
