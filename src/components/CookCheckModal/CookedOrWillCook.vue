<template>
  <q-card class="CookedWillNotCard">
    <!-- <div class="row">
      <q-space></q-space>
      <q-icon name="close" v-close-popup size="22px" style="margin-left:5px;"></q-icon>
    </div>-->
    <q-card-section class="row items-center" style="font-size:18px;font-weight:bold">
      <span class="q-ml-sm">作った料理ですか？それとも後で作りたい料理ですか？</span>
    </q-card-section>
    <div class="containerWrapper">
      <div class="Container column">
        <q-img class="ContainerImg" src="statics/dish/dish.png"></q-img>
        <q-btn class="btnLeft" label="料理済み" v-close-popup @click="$emit('setMadeOrNot',true)" />
      </div>
      <div class="Container column">
        <q-img class="ContainerImg" src="statics/dish/vegetables.png"></q-img>
        <q-btn class="btnRight" label="後でつくる" v-close-popup @click="$emit('setMadeOrNot',false)" />
      </div>
    </div>
    <div
      class="row"
      style="width:90%;margin-right:auto;margin-left:auto;margin-top:10px;margin-bottom:10px"
    >
      <q-space></q-space>
      <q-btn label="close" flat v-close-popup></q-btn>
    </div>
  </q-card>
</template>

<script>
</script>

<style>
.Container {
  width: 45%;
}
.ContainerImg {
  width: 90px;
  margin-right: auto;
  margin-left: auto;
}
.containerWrapper {
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.btnLeft {
  background-color: rgb(35, 177, 177);
  width: 130px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
}
.btnRight {
  background-color: rgb(158, 225, 58);
  width: 130px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
}
</style>