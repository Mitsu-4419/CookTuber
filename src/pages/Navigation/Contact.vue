<template>
  <div>
    <q-page padding class="bg-grey-1">
      <q-card class="contact-tabs absolute-center">
        <q-card-section>
          <h6 class="text-bold q-mt-sm OtoiawaseTitle">
            お問い合わせ
          </h6>
          <div class="OtoiawaseDetail">
            サービスの品質向上のため、お客様からのお問い合わせをお待ちしております。
            <br />ご利用にあたって改善すべき点や欲しい機能などお気づきの点がございましたら、下記のリンクよりご連絡お願い申し上げます。
            <br />また、弊社では駆け出しYouTuberの皆様をブロックチェーンを用いて応援する、
            <a href="https://cryptotuber.com/" target="_blank">CryptoTuber</a
            >を運営しております。
            ご興味を持たれたYouTubeチャンネルをお持ちのYouTuberの方は、同フォームから弊社宛にご連絡頂けますと幸いです。
            <br />後日担当者よりご連絡をさせて頂きます。
          </div>
        </q-card-section>
        <div class="Contact-wrapper">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScF-4PLF90SYREW5-QbpbRxb_d7uSgKJ8FwCqPyLLH6ZdNWjg/viewform"
            target="_blank"
            class="text-blue-9 text-subtitle2 cursor-pointer ContactUp"
            >お問い合わせをする</a
          >
          <br />
        </div>
      </q-card>
    </q-page>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  components: {}
};
</script>

<style scoped>
.contact-tabs {
  width: 450px;
  height: 450px;
  border-radius: 10px;
  margin: auto;
  padding: 10px 30px;
}
.OtoiawaseTitle {
  margin-bottom: 24px;
}
.OtoiawaseDetail {
  font-size: 15px;
  font-weight: bold;
}
.Contact-wrapper {
  width: 90%;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;
}
.ContactUp {
  margin-right: auto;
  margin-left: auto;
  margin-top: 15px;
}
.q-mb-lg {
  margin-top: 16px;
  margin-bottom: 16px;
}
a {
  text-decoration: none;
}
@media screen and (min-width: 360px) and (max-width: 499px) {
  .contact-tabs {
    width: 325px;
    height: 450px;
    border-radius: 10px;
    margin: auto;
    padding: 10px 30px;
  }
  .OtoiawaseTitle {
    margin-bottom: 10px;
  }
  .OtoiawaseDetail {
    font-size: 13px;
    font-weight: bold;
  }
}
</style>
