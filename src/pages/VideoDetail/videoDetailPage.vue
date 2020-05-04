<template>
  <q-page padding>
    <div class="back_button row">
      <router-link to="/youtubers">
        <q-icon name="chevron_left" size="xl" color="black" />
        <span class="text-h6 text-grey-7 vertical-middle">YouTuber 一覧</span>
      </router-link>
    </div>
    <!-- ーーーーーーーーーーー -->
    <!-- ページ上部のプロフィール載せる欄 -->
    <!-- ーーーーーーーーーーー -->
    <div class="row card-holder">
      <div class="card-wrapper">
        <q-video
          v-if="liveDetailKeys.includes(key)"
          id="ytplayer"
          type="text/html"
          :src="
            'https://www.youtube.com/embed/' +
              liveDetail[key].videoId +
              '?autoplay=0&origin=http://example.com'
          "
          frameborder="0"
        ></q-video>
        <q-video
          v-else-if="liveWaitDetailKeys.includes(key)"
          id="ytplayer"
          type="text/html"
          :src="
            'https://www.youtube.com/embed/' +
              liveWaitDetail[key].videoId +
              '?autoplay=0&origin=http://example.com'
          "
          frameborder="0"
        ></q-video>
        <div v-else class="card-img">
          <q-img :src="YoutubersChannel_info[key].iconUrl" basic></q-img>
        </div>
      </div>
      <div class="cardDetailWrapper">
        <div class="row" @click.prevent="switchFav()">
          <q-icon
            v-model="ratingModel"
            name="fas fa-star"
            size="1.8em"
            :class="ratingModel == 1 ? 'starActive' : 'starNonActive'"
          />
          <span class="favoriteNum">{{ getNumberArray[key] }}</span>
        </div>
        <div class="row q-mt-lg">
          <q-icon name="videogame_asset" size="md" class="q-mr-sm" />
          <div class="text-h5 tex-bold">{{ YoutubersChannel_info[key].name }}</div>
        </div>
        <div class="price-buy-detail q-mt-lg">
          <q-scroll-area style="height: 180px; max-width: 400px;">
            <div class="text-body1 text-grey-7">{{ YoutubersChannel_info[key].description }}</div>
          </q-scroll-area>
        </div>
        <div class="infoWrapper">
          <!-- チャンネル登録日 -->
          <div class="registerDateWrapper">
            <span>チャンネル登録日：</span>
            <span class="text-bold">
              {{
              YoutubersChannel_info[key].register_date
              }}
            </span>
          </div>
          <!-- 現時点でのチャンネル登録者数 -->
          <div class="subscriberCountsWrapper">
            <span>現チャンネル登録者数：</span>
            <span class="text-bold">
              {{
              YoutubersChannel_info[key].subscriberCounts
              }}
            </span>
          </div>
          <!-- Twitterアカウント -->
          <div class="iconsWrapper" v-if="YoutubersChannel_info[key].twitterId">
            <a v-bind:href="YoutubersChannel_info[key].twitterId" target="_blank">
              <img src="../../statics/socialIcons/twitter.png" width="40px" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ユーザーのレビューを載せる欄 -->
    <div class="userReview_wrapper">
      <div class="review_title_wrapper">
        <span>ファンからのオススメ</span>
      </div>
      <q-separator style="height:3px;margin-top:10px;margin-bottom:13px;" />
      <div class="row detailReviewCardWrapper">
        <transition-group appear enter-active-class="animated fadeInLeft" class="row">
          <userReviewCard
            :review="review"
            :id="key"
            v-for="(review, key) in userReviews"
            :key="key"
          />
        </transition-group>
      </div>
    </div>

    <!-- ユーザー登録をする様に促すDialog -->
    <q-dialog v-model="alertToSignUp">
      <ToLoginAlert />
    </q-dialog>
    <!-- レビュー投稿モーダル -->
    <q-dialog v-model="writeReview">
      <reviewSubmit
        @closeReviewSubmit="closeReviewSubmi"
        @addstar="addstar"
        :channelInfo="YoutubersChannel_info[key]"
      />
    </q-dialog>
  </q-page>
</template>


<script>
</script>


<style>
</style>