<template>
  <div>
    <div class="q-pa-md Account_wrapper" style="max-width: 800px">
      <h6 class="text-bold q-mt-lg" style="margin-bottom:8px;">{{ userName }} さんの登録情報</h6>
      <q-list bordered separator>
        <!-- --- -->
        <!-- 上段 -->
        <!-- --- -->
        <!-- アイコンの写真設定 -->
        <q-item>
          <q-item-section>
            <q-item-label @click.stop="showEditPhotoURL = true" class="text-subtitle1">アイコン</q-item-label>
          </q-item-section>
          <q-avatar @click.stop="showEditPhotoURL = true" size="100px">
            <img :src="usersPublicInfo[this.userId].photoURL" />
          </q-avatar>
          <q-item-section side class="row">
            <div class="column">
              <q-icon name="edit" class="column" size="xs" @click.stop="showEditPhotoURL = true"></q-icon>
            </div>
          </q-item-section>
        </q-item>
        <!-- ユーザーネーム -->
        <q-item>
          <q-item-section @click.stop="showEditName = true" class="text-subtitle1">アカウントネーム</q-item-section>
          <q-item-section side class="row">
            <div class="text-subtitle1 text-black column" v-if="userName">
              <span @click.stop="showEditName = true" class="q-mr-sm">
                {{
                userName
                }}
              </span>
            </div>
            <div v-else>
              <span @click.stop="showEditName = true" class="text-grey-5">未設定</span>
            </div>
          </q-item-section>
          <q-item-section side class="row">
            <div class="column">
              <q-icon name="edit" class="column" size="xs" @click.stop="showEditName = true"></q-icon>
            </div>
          </q-item-section>
        </q-item>
        <!-- 自己紹介 -->
        <q-item>
          <q-item-section @click.stop="showEditIntroduction = true" class="text-subtitle1">プロフィール</q-item-section>
          <q-item-section side class="row">
            <div class="text-subtitle1 text-black column" v-if="userIntroduction">
              <span @click.stop="showEditIntroduction = true" class="q-mr-sm">
                {{
                userIntroduction
                }}
              </span>
            </div>
            <div v-else>
              <span @click.stop="showEditIntroduction = true" class="text-grey-5">未設定</span>
            </div>
          </q-item-section>
          <q-item-section side class="row">
            <div class="column">
              <q-icon
                name="edit"
                class="column"
                size="xs"
                @click.stop="showEditIntroduction = true"
              ></q-icon>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="q-pa-md Account_wrapper" style="max-width: 800px">
      <q-list bordered separator>
        <!-- 利用規約 -->
        <q-item>
          <q-item-section>
            <q-item-label @click.stop="TermsOfService = true" class="text-subtitle1">利用規約</q-item-label>
          </q-item-section>
          <q-item-section side class="row">
            <div class="column">
              <q-icon
                name="keyboard_arrow_right"
                class="column"
                size="xs"
                @click.stop="TermsOfService = true"
              ></q-icon>
            </div>
          </q-item-section>
        </q-item>
        <!-- --- -->
        <!-- 下段 -->
        <!-- --- -->
        <!-- プライバシーポリシー -->
        <q-item>
          <q-item-section>
            <q-item-label @click.stop="PrivacyPolicy = true" class="text-subtitle1">プライバシーポリシー</q-item-label>
          </q-item-section>
          <q-item-section side class="row">
            <div class="column">
              <q-icon
                @click.stop="PrivacyPolicy = true"
                name="keyboard_arrow_right"
                class="column"
                size="xs"
              ></q-icon>
            </div>
          </q-item-section>
        </q-item>
        <!-- 退会 -->
        <q-item>
          <q-item-section>
            <q-item-label @click.stop="UserWithdrawal = true" class="text-subtitle1">退会する</q-item-label>
          </q-item-section>
          <q-item-section side class="row">
            <div class="column">
              <q-icon
                @click.stop="UserWithdrawal = true"
                name="keyboard_arrow_right"
                class="column"
                size="xs"
              ></q-icon>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <!-- ---------- -->
    <!-- 下記モーダル -->
    <!-- ---------- -->
    <!-- URL変更のモーダル -->
    <q-dialog v-model="showEditPhotoURL">
      <editPhotoURL @close="showEditPhotoURL = false" :userInfo="usersPublicInfo[this.userId]"></editPhotoURL>
    </q-dialog>
    <!-- 名前の変更モーダル -->
    <q-dialog v-model="showEditName">
      <editName
        @close="showEditName = false"
        :userName.sync="userName"
        :userInfo="usersPublicInfo[this.userId]"
      ></editName>
    </q-dialog>
    <!-- プロフィールの変更モーダル -->
    <q-dialog v-model="showEditIntroduction">
      <editIntroduction
        @close="showEditIntroduction = false"
        :userIntroduction.sync="userIntroduction"
        :userInfo="usersPublicInfo[this.userId]"
      ></editIntroduction>
    </q-dialog>
    <!-- 利用規約のモーダル -->
    <q-dialog v-model="TermsOfService">
      <TermsOfService />
    </q-dialog>
    <!-- プライバシーポリシーのモーダル -->
    <q-dialog v-model="PrivacyPolicy">
      <PrivacyPolicy />
    </q-dialog>
    <!-- 退会処理のモーダル -->
    <q-dialog v-model="UserWithdrawal">
      <UserWithdrawal />
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      userName: "",
      userIntroduction: "",
      showEditName: false,
      showEditPhotoURL: false,
      showEditIntroduction: false,
      TermsOfService: false,
      PrivacyPolicy: false,
      UserWithdrawal: false
    };
  },
  computed: {
    ...mapState("auth", ["userId"]),
    ...mapState("usersPublic", ["usersPublicInfo"])
  },
  methods: {},
  components: {
    editName: require("components/Modals/EditName.vue").default,
    editPhotoURL: require("components/Modals/EditPhotoURL.vue").default,
    editIntroduction: require("components/Modals/EditIntroduction.vue").default,
    TermsOfService: require("components/Auth/TermsOfService.vue").default,
    PrivacyPolicy: require("components/Auth/PrivacyPolicy.vue").default,
    UserWithdrawal: require("components/Auth/UserWithdrawal.vue").default
  },
  created() {
    this.userName = this.usersPublicInfo[this.userId].nickName;
    this.userIntroduction = this.usersPublicInfo[this.userId].introduction;
  }
};
</script>

<style>
.Account_wrapper {
  margin-left: auto;
  margin-right: auto;
}
.photoURLinput {
  width: 350px;
  white-space: nowrap;
  overflow: scroll;
}
</style>
