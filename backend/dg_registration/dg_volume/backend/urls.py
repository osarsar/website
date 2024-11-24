from django.contrib import admin
from django.urls import path, include
from pages.views import CreateUserView, UserProfileView, AddFriendView, ListFriendsView, RemoveFriendView, FriendProfileView, LogoutView, UserSettingsView, SearchUserView, LeaderboardView, AnonymizeDataView, UserInfoView, DeleteUserView, PermanentDeleteAccountView, PermanentDeleteAccountView, RestoreAccountView, UserIsDeletedView, GoogleLoginView, WhoTalkedWith, LoadMessagesView, SearchFriends
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("pages.urls")),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/add_friend/<str:username>/', AddFriendView.as_view(), name='add-friend'),
    path('api/friends/', ListFriendsView.as_view(), name='list-friends'),
    path('api/remove_friend/<str:username>/', RemoveFriendView.as_view(), name='remove-friend'),
    path('api/friend_profile/<str:username>/', FriendProfileView.as_view(), name='friend-profile'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/user/settings/', UserSettingsView.as_view(), name='user-settings'),
    path("api/user/search/", SearchUserView.as_view(), name='search-user'),
    path("api/user/leaderboard/", LeaderboardView.as_view(), name='leaderboard'),
    path("api/user/anonymize-data/", AnonymizeDataView.as_view(), name='anonymize-data'),
    path('api/user/UserInfo/', UserInfoView.as_view(), name='user-info'),
    path('api/user/UserDelete/', DeleteUserView.as_view(), name='user-info'),
    path('api/user/permanent-delete/', PermanentDeleteAccountView.as_view(), name='permanent-delete'),
    path('api/user/restore/', RestoreAccountView.as_view(), name='restore-account'),
    path('api/user/is_deleted/', UserIsDeletedView.as_view(), name='user-status'),
    path('api/auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('accounts/', include('allauth.urls')),
    # path('api/send_code/', SendVerificationCodeView.as_view(), name='send_code'),
    # path('api/verify_code/', VerifyCodeView.as_view(), name='verify_code'),
    path('users/', WhoTalkedWith.as_view(), name='users'),
    path('loadmessages/', LoadMessagesView.as_view(), name='loadmessages'),
    path('searchusers/<str:friendUsername>/', SearchFriends.as_view(), name='searchusers'),# New path
    
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
