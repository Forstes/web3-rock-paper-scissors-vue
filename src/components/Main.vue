<script setup lang="ts">
import rpsAbi from "@/abi/rps.json";
import { useWallet } from "@/scripts/wallet";
import { ethers } from "ethers";
import { onMounted, ref } from "vue";
import Spinner from "@/components/Spinner.vue";

// Instantiate the contract
const contractAddress = "0x88bDE1C98599092Ce791857da53f090b4C0AA73E";
const { connect, refreshBalance } = useWallet();

onMounted(() => {
  connect()
    .then((signer) => {
      contract = new ethers.Contract(contractAddress, rpsAbi, signer);

      // Subscribe to the event
      contract.on("SoloPlayed", (player: string, isWinner: boolean, opponentChoice: number, event: any) => {
        opponentMove.value = moves.find((s) => s.move == opponentChoice);
        isPlayerWon.value = isWinner;
        isInProcess.value = false;
        refreshBalance();
        console.log(`Event ${event.event}: Player ${player} played vs move ${opponentChoice}. Winner: ${isWinner}.`);
      });

      contract.on("TieGame", () => {
        isTieGame.value = true;
        isInProcess.value = false;
      });
    })
    .catch((e) => alert(e));
});

let contract: any;

enum Move {
  Rock,
  Paper,
  Scissors,
}

let bet = 0.0001;
const isPlayerWon = ref(false);
const isTieGame = ref(false);
const isInProcess = ref(false);
const moveChosen = ref<Move>();
const opponentMove = ref();

const moves = [
  { img: "./assets/rock.png", move: Move.Rock },
  { img: "./assets/paper.png", move: Move.Paper },
  { img: "./assets/scissors.png", move: Move.Scissors },
];

function chooseMove(move: Move) {
  moveChosen.value = move;
}

function dropGameState() {
  opponentMove.value = null;
  isPlayerWon.value = false;
  isTieGame.value = false;
}

async function play() {
  if (isInProcess.value) return;
  isInProcess.value = true;
  dropGameState();
  const value = ethers.utils.parseEther(String(bet));
  const tx = await contract.playSolo(moveChosen.value, { value });
  await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);
}
</script>

<template>
  <div class="h-full grid grid-cols-2 gap-3">
    <div class="py-6 col-span-2 md:col-span-1 border border-2 rounded-lg text-center">
      <h2 class="text-3xl font-bold text-lime-500">You</h2>

      <div class="my-8">
        <label class="text-lg">Your bet: </label>
        <input
          class="ml-2 border rounded-lg px-4 py-1 outline-none"
          type="number"
          min="0.0001"
          step="0.0001"
          placeholder="0.0001"
          v-model="bet"
        />
      </div>

      <h2 class="text-2xl font-semibold">Make your choice</h2>
      <ul class="flex flex-wrap items-center justify-center gap-3 py-8">
        <li
          class="rounded-xl p-3 border cursor-pointer hover:border-lime-500"
          :class="{ 'border-lime-500': moveChosen == m.move }"
          v-for="m in moves"
          @click="chooseMove(m.move)"
        >
          <img :src="m.img" class="w-32 h-32" />
        </li>
      </ul>

      <button
        class="mt-3 px-6 py-2 rounded-lg bg-lime-500 text-white tracking-widest hover:scale-110 disabled:scale-100 hover:bg-lime-600 disabled:bg-lime-200"
        :disabled="isInProcess"
        @click="play"
      >
        PLAY
      </button>

      <h2 class="mt-6 text-lime-700" v-if="isPlayerWon && !isTieGame && opponentMove">You won! Reward: {{ bet * 2 }} tBNB</h2>
      <h2 class="mt-6 text-rose-700" v-if="!isPlayerWon && !isTieGame && opponentMove">You lose! -{{ bet }} tBNB</h2>
      <h2 class="mt-6 text-yellow-500" v-if="isTieGame && opponentMove">Tie Game</h2>
    </div>

    <div class="py-6 col-span-2 md:col-span-1 border border-2 rounded-lg text-center">
      <h2 class="text-3xl font-bold text-red-500">Opponent</h2>
      <div class="mt-12 flex items-center justify-center">
        <div class="rounded-xl p-3 border" v-if="opponentMove">
          <img :src="opponentMove?.img" class="w-32 h-32" />
        </div>

        <spinner class="w-8 h-8" v-if="isInProcess" />
      </div>
    </div>
  </div>
</template>
