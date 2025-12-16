<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAppOptionStore } from '@/stores/app-option';
    import { useAuthStore } from "@/stores/auth";
    import coverImage from '@/images/profile-cover.jpg';
    import avatarImage from '@/images/Avatars.png';
    
    const router = useRouter();
    const appOption = useAppOptionStore();
    const authStore = useAuthStore();
    const user = ref(null);
    const isLoading = ref(false);
    const showProfileDropdown = ref(false);
    
    // Single service - Bushman ERP
    const bushmanService = {
      name: 'Bushman ERP',
      service_id: 1,
      color: '#ffffff'
    };
    
    const navigateToService = async () => {
      isLoading.value = true;
      const startTime = Date.now();
      const minLoadingTime = 2000; // 2 seconds
      
      try {
        // Navigate directly to dashboard - no permission checks needed
        await router.push({ name: 'dashboard' });
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        // Ensure loading shows for at least 2 seconds
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        if (remainingTime > 0) {
          setTimeout(() => {
            isLoading.value = true;
          }, remainingTime);
        } else {
          isLoading.value = false;
        }
      }
    };
    
    const toggleProfileDropdown = () => {
      showProfileDropdown.value = !showProfileDropdown.value;
    };
    
    const handleLogout = () => {
      authStore.logout();
      router.push({ name: 'login' });
    };
    
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('.user-profile-dropdown')) {
        showProfileDropdown.value = false;
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      appOption.appSidebarHide = true;
      appOption.appHeaderHide = true;
      appOption.appContentClass = "p-0";
      appOption.appFooter = false;
      appOption.appFooterFixed = false;
    
      // Get user from auth store
      const userData = authStore.currentUser || JSON.parse(sessionStorage.getItem('user') || 'null');
      user.value = userData;
      
      // Add click outside listener
      document.addEventListener('click', handleClickOutside);
    });
    
    onBeforeUnmount(() => {
      appOption.appSidebarHide = false;
      appOption.appHeaderHide = false;
      appOption.appContentClass = "";
      appOption.appFooter = true;
      appOption.appFooterFixed = true;
      
      // Remove click outside listener
      document.removeEventListener('click', handleClickOutside);
    });
    </script>
    
    <template>
      <div class="profile">
        <!-- BEGIN top navigation bar -->
        <div class="top-nav-bar">
          <div class="nav-content">
            <div class="nav-left">
              <i class="fa fa-bars hamburger-menu"></i>
              <img src="/logo.png" class="nav-logo" alt="BUSHMAN Logo" />
            </div>
             <div class="nav-right">
               <div class="user-profile-dropdown">
                 <div class="user-info" @click="toggleProfileDropdown">
                   <div class="user-avatar-icon">
                     <img :src="avatarImage" alt="User Avatar" />
                     <span class="status-indicator"></span>
                   </div>
                   <span class="user-email">{{ user?.email || 'No email available' }}</span>
                 </div>
                 <div v-if="showProfileDropdown" class="profile-dropdown-menu">
                   <a href="#" class="dropdown-item" @click.prevent>
                     <span>Profile Setting</span>
                     <i class="fa fa-wrench"></i>
                   </a>
                   <a href="#" class="dropdown-item" @click.prevent="handleLogout">
                     <span>Log Out</span>
                     <i class="fa fa-toggle-off"></i>
                   </a>
                 </div>
               </div>
               <button class="settings-btn">
                 <i class="fa fa-cog"></i>
               </button>
             </div>
          </div>
          <div class="nav-bottom-bar"></div>
        </div>
        <!-- END top navigation bar -->
    
         <!-- BEGIN profile-header -->
         <div class="profile-header">
           <div class="profile-header-cover" :style="{ backgroundImage: `url(${coverImage})` }"></div>
           <div class="profile-header-content">
             <div class="profile-header-img">
               <img :src="avatarImage" alt="User Avatar" />
             </div>
           </div>
         </div>
         <!-- END profile-header -->
    
        <!-- BEGIN profile-container -->
        <div class="profile-container">
           <!-- BEGIN profile-sidebar -->
           <div class="profile-sidebar">
             <div class="desktop-sticky-top">
               <!-- Name -->
              <h2 class="profile-sidebar-name">{{ user?.username || user?.name || 'hussein' }}</h2>
              
              <!-- Contact details with icons -->
              <div class="contact-item">
                <i class="fa fa-envelope"></i>
                <span>{{ user?.email || 'hussein@aboodbus.co.tz' }}</span>
              </div>
              <div class="contact-item">
                <i class="fa fa-phone"></i>
                <span>{{ user?.phone_number || user?.phone || '0622181327' }}</span>
              </div>
              
              <p class="profile-description">{{ user?.description || 'No description available.' }}</p>
              
              <hr class="divider">
              
              <div class="contact-item">
                <i class="fa fa-map-marker-alt"></i>
                <span>Morogoro, TZ</span>
              </div>
              <div class="contact-item">
                <i class="fa fa-link"></i>
                <span>aboodbus.com</span>
              </div>
            </div>
          </div>
          <!-- END profile-sidebar -->
    
          <!-- BEGIN profile-content -->
          <div class="profile-content">
            <!-- Bushman ERP Service -->
            <div @click="navigateToService" class="service-card-wrapper" :class="{ 'loading': isLoading }">
              <div class="service-card">
                <div v-if="isLoading" class="loading-overlay">
                  <div class="loading-spinner"></div>
                  <p class="loading-text">Loading...</p>
                </div>
                <div class="service-card-content" :class="{ 'loading-content': isLoading }">
                  <img src="/logo.png" class="service-logo" alt="Service Logo" />
                  <h3 class="service-title">{{ bushmanService.name }}</h3>
                  <hr class="service-divider" />
                </div>
              </div>
            </div>
          </div>
          <!-- END profile-content -->
        </div>
        <!-- END profile-container -->
      </div>
    </template>
    
    <style scoped>
    .profile {
      min-height: 100vh;
      background-color: #e8ebf0;
    }
    
    /* TOP NAVIGATION BAR */
    .top-nav-bar {
      background: #ffffff;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .nav-content {
      padding: 12px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .nav-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .hamburger-menu {
      font-size: 18px;
      color: #333;
      cursor: pointer;
      padding: 8px;
    }
    
    .nav-logo {
      height: 35px;
      object-fit: contain;
    }
    
    .nav-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-profile-dropdown {
      position: relative;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    
    .user-avatar-icon {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
    }
    
    .user-avatar-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 9px;
      height: 9px;
      background-color: #00d4aa;
      border: 2px solid #ffffff;
      border-radius: 50%;
    }
    
     .user-email {
       font-size: 13px;
       color: #333;
       font-weight: 700;
     }
    
    .settings-btn {
      background: transparent;
      border: none;
      color: #666;
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
      transition: color 0.2s;
    }
    
    .settings-btn:hover {
      color: #333;
    }
    
    .nav-bottom-bar {
      height: 1px;
      background: #d0d0d0;
      width: 100%;
    }
    
    .profile-dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      padding: 8px 0;
      z-index: 1001;
      border: 1px solid #e0e0e0;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      font-size: 14px;
      transition: background-color 0.2s;
      cursor: pointer;
    }
    
    .dropdown-item:hover {
      background-color: #f5f5f5;
    }
    
    .dropdown-item span {
      flex: 1;
    }
    
    .dropdown-item i {
      color: #4a90e2;
      font-size: 16px;
      margin-left: 12px;
    }
    
    /* HEADER */
    .profile-header {
      position: relative;
      padding: 10px 10px 10px 10px;
      margin-top: 60px;
    }
    
    .profile-header-cover {
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      height: 170px;
      position: relative;
      width: 100%;
      border-radius: 4px;
    }
    
    .profile-header-cover::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(33, 37, 41, 0.35);
    }
    
    .profile-header-content {
      position: relative;
      padding: 0 30px;
      display: flex;
      align-items: flex-end;
    }
    
    .profile-header-img {
      width: 200px;
      height: 200px;
      overflow: hidden;
      z-index: 10;
      margin-top: -140px;
      margin-left: 40px;
      padding: 3px;
      background: #ffffff;
      border-radius: 0.5rem;
    }
    
    .profile-header-img img {
      max-width: 100%;
      width: 100%;
      border-radius: 0.25rem;
    }
    
    
     /* MAIN LAYOUT */
     .profile-container {
       padding: 0 30px;
       display: flex;
       margin-top: 20px;
     }
     
     /* SIDEBAR */
     .profile-sidebar {
       width: 220px;
       background: transparent;
       border-radius: 0;
       padding: 0;
       box-shadow: none;
       position: relative;
       height: fit-content;
       margin-left: 24px;
     }
    
    
    /* USER INFO */
    .profile-sidebar-name {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 12px;
      margin-top: 0;
      color: #000000;
    }
    
    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      color: #666666;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    
    .contact-item i {
      color: #999999;
      width: 16px;
      margin-top: 2px;
      flex-shrink: 0;
    }
    
    .profile-description {
      margin: 12px 0;
      font-size: 13px;
      color: #666666;
      line-height: 1.5;
    }
    
    .divider {
      margin: 15px 0;
      border: none;
      border-top: 1px solid #d0d0d0;
    }
    
     /* CONTENT */
     .profile-content {
       padding-left: 10px;
       flex: 1;
     }
    
    /* SERVICE CARD */
    .service-card-wrapper {
      cursor: pointer;
      display: inline-block;
    }
    
    .service-card {
      width: 360px;
      height: 200px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
    }
    
    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }
    
    .service-card-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    
    .service-logo {
      height: 50px;
      margin-bottom: 15px;
      object-fit: contain;
    }
    
    .service-title {
      font-size: 22px;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
      font-family: 'Courier New', monospace;
      letter-spacing: 0.5px;
    }
    
    .service-divider {
      width: 60%;
      border: none;
      border-top: 2px solid #8B4513;
      margin: 15px 0 0;
    }
    
    /* LOADING UI */
    .service-card-wrapper.loading {
      cursor: wait;
      pointer-events: none;
    }
    
    .service-card-wrapper.loading .service-card {
      opacity: 0.7;
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;
      border-radius: 8px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #8B4513;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 12px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .loading-text {
      color: #8B4513;
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }
    
    .service-card-content.loading-content {
      opacity: 0.5;
    }
    
     /* MOBILE */
     @media (max-width: 768px) {
       .profile-header-cover {
         height: 100px;
       }
       
       .profile-header-content {
         display: block;
         padding: 0 15px;
       }
       
       .profile-header-img {
         width: 70px;
         height: 70px;
         margin: -60px 0 0;
       }
       
       .profile-container {
         padding: 15px;
         flex-direction: column;
       }
       
       .profile-sidebar {
         display: none;
       }
       
       .profile-content {
         padding-left: 0;
       }
       
       .service-card {
         width: 100%;
         max-width: 400px;
       }
       
       .nav-content {
         padding: 12px 15px;
       }
       
       .user-email {
         display: none;
       }
     }
    
    @media (max-width: 576px) {
      .service-card {
        width: 100%;
      }
      
      .hamburger-menu {
        font-size: 16px;
      }
      
      .nav-logo {
        height: 30px;
      }
    }
    </style>