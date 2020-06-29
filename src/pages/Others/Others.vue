<template>
  <div>
    <q-page padding>
      <div class="q-pa-md Account_wrapper" style="max-width: 800px">
        <q-list bordered separator>
          <!-- 利用規約 -->
          <q-item>
            <q-item-section>
              <q-item-label class="text-subtitle1">運営会社</q-item-label>
            </q-item-section>
            <span class="text-subtitle1">株式会社 Block Aid</span>
          </q-item>
          <!-- 利用規約 -->
          <q-item>
            <q-item-section>
              <q-item-label
                @click.stop="TermsOfService = true"
                class="text-subtitle1"
                >利用規約</q-item-label
              >
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
              <q-item-label
                @click.stop="PrivacyPolicy = true"
                class="text-subtitle1"
                >プライバシーポリシー</q-item-label
              >
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
          <q-item>
            <q-item-section>
              <q-item-label
                @click.stop="PrivacyPolicy = true"
                class="text-subtitle1"
                >お問い合わせ</q-item-label
              >
            </q-item-section>
            <q-item-section side class="row">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScF-4PLF90SYREW5-QbpbRxb_d7uSgKJ8FwCqPyLLH6ZdNWjg/viewform"
                target="_blank"
                >こちら</a
              >のリンクからアクセスください
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <!-- ---------- -->
      <!-- 下記モーダル -->
      <!-- ---------- -->
      <!-- 利用規約のモーダル -->
      <q-dialog v-model="TermsOfService">
        <TermsOfService />
      </q-dialog>
      <!-- プライバシーポリシーのモーダル -->
      <q-dialog v-model="PrivacyPolicy">
        <PrivacyPolicy />
      </q-dialog>
    </q-page>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      TermsOfService: false,
      PrivacyPolicy: false,
      UserWithdrawal: false
    };
  },
  computed: {},
  methods: {},
  components: {
    TermsOfService: require("components/Auth/TermsOfService.vue").default,
    PrivacyPolicy: require("components/Auth/PrivacyPolicy.vue").default,
    UserWithdrawal: require("components/Auth/UserWithdrawal.vue").default
  },
  created() {}
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
