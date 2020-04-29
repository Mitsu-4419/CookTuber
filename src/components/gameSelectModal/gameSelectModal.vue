<template>
  <q-card class="genreSelectCard">
    <q-card-section class="row items-center q-pb-none">
      <div class="genreSelectTitle">ゲーム一覧</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <div class="row genreWrapper">
      <q-btn name="Mario" class="SizeTab" flat @click="$emit('selectedTab', 'Mario')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/mario.png" />
      </q-btn>
      <q-btn name="Pokemon" class="SizeTabSec" flat @click="$emit('selectedTab', 'Pokemon')">
        <img src="/statics/gamePackage/pokemon.png" class="GameGenreSelectImg" alt />
      </q-btn>
      <q-btn name="MineCraft" class="SizeTab" flat @click="$emit('selectedTab', 'Minecraft')">
        <img src="/statics/gamePackage/minecraft.png" class="GameGenreSelectImg" alt />
      </q-btn>
      <q-btn name="Fortnite" class="SizeTabSec" flat @click="$emit('selectedTab', 'Fortnite')">
        <img src="/statics/gamePackage/fortnite.png" class="GameGenreSelectImg" alt />
      </q-btn>
      <q-btn name="ARK" class="SizeTab" flat @click="$emit('selectedTab', 'ARK')">
        <img src="/statics/gamePackage/ark.png" class="GameGenreSelectImg" alt />
      </q-btn>
      <q-btn name="Atumori" class="SizeTabSec" flat @click="$emit('selectedTab', 'Atumori')">
        <img src="/statics/gamePackage/atumori.png" class="GameGenreSelectImg" alt />
      </q-btn>
      <q-btn name="LoL" class="SizeTabSec" flat @click="$emit('selectedTab', 'LoL')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/lol.png" />
      </q-btn>
      <q-btn name="DQ" class="SizeTab" flat @click="$emit('selectedTab', 'DQ')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/dq.png" />
      </q-btn>
      <q-btn name="FF" class="SizeTabSec" flat @click="$emit('selectedTab', 'FF')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/FFImg.jpg" />
      </q-btn>
      <q-btn name="Zelda" class="SizeTab" flat @click="$emit('selectedTab', 'Zelda')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/zelda.png" />
      </q-btn>
      <q-btn name="Splatoon" class="SizeTabSec" flat @click="$emit('selectedTab', 'Splatoon')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/splatoon.png" />
      </q-btn>
      <q-btn name="GTA" class="SizeTab" flat @click="$emit('selectedTab', 'GTA')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/gta.png" />
      </q-btn>
      <q-btn name="MH" class="SizeTabSec" flat @click="$emit('selectedTab', 'MH')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/mh.png" />
      </q-btn>
      <q-btn name="CoD" class="SizeTab" flat @click="$emit('selectedTab', 'CoD')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/cod.png" />
      </q-btn>
      <q-btn
        name="WinningEleven"
        class="SizeTabSec"
        flat
        @click="$emit('selectedTab', 'WinningEleven')"
      >
        <img class="GameGenreSelectImg" src="/statics/gamePackage/winningeleven.png" />
      </q-btn>
      <q-btn name="荒野行動" class="SizeTab" flat @click="$emit('selectedTab', 'Koyakodo')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/koyakodo.png" />
      </q-btn>
      <q-btn name="レトロ" class="SizeTabSec" flat @click="$emit('selectedTab', 'Retro')">
        <img class="GameGenreSelectImg" src="/statics/gamePackage/retroGameImg.jpeg" />
      </q-btn>
    </div>
  </q-card>
</template>

<script></script>

<style>
.GameGenreSelectImg {
  width: 100px;
}
.genreSelectTitle {
  font-size: 26px;
  margin-top: 10px;
  font-weight: bold;
  color: #443f5f;
  margin-left: 18px;
}
.genreSelectCard {
  min-width: 770px;
}
.genreWrapper {
  width: 700px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 20px;
}
@media screen and (min-width: 500px) and (max-width: 767px) {
  .GameGenreSelectImg {
    width: 70px;
  }
  .genreSelectCard {
    min-width: 500px;
  }
  .genreWrapper {
    width: 430px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 20px;
  }
}
@media screen and (min-width: 320px) and (max-width: 499px) {
  .GameGenreSelectImg {
    width: 70px;
  }
  .genreSelectCard {
    min-width: 310px;
  }
  .genreWrapper {
    width: 300px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 20px;
  }
}
@media screen and (min-width: 320px) and (max-width: 499px) {
  .GameGenreSelectImg {
    width: 70px;
  }
  .genreSelectCard {
    min-width: 310px;
  }
  .genreWrapper {
    width: 300px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 20px;
  }
}
</style>
