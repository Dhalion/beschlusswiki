<template>
    <UIcon name="i-heroicons-question-mark-circle" @click="isOpen = true"
        class="w-5 h-5 ml-3 text-slate-600 self-center hover:cursor-pointer hover:text-slate-800" />
    <UModal v-model="isOpen" title="How to search" class="w-96">
        <UCard>
            <template #header>
                <h2 class="text-lg font-bold">Wie suche ich?</h2>
            </template>
            <template #default>
                <p class="mb-3">Du kannst einfach nach einem oder mehreren Stichwörten suchen, und bekommst dann die
                    Beschlüsse
                    angezeigt, die am besten passen.</p>
                <UDivider />
                <p class="my-3">Wenn du die Ergebnisse weiter angrenzen möchtest, kannst du in der Erweiterten Suche
                    auch den
                    Zeitraum oder die Kategorie wählen.</p>
                <UDivider />
                <p class="my-3">Du kannst in der Suchleiste auch Query-Operatoren nutzen:
                <ul>
                    <li>+ symbolisiert eine UND Verknüpfung</li>
                    <li>| symbolisiert eine ODER Verknüpfung</li>
                    <li>- symbolisiert eine NICHT Verknüpfung</li>
                    <li>" " symbolisiert eine exakte Suche</li>
                    <li>* am Ende eines Wortes symbolisiert eine Wildcard Suche</li>
                    <li>( ) symbolisiert eine Gruppierung</li>
                </ul>
                <p>Beispiel: "Solar" -Wind*</p>
                <p>Damit suchst du nach Beschlüssen, die das Wort "Solar" enthalten, aber keine Wörter, die mit
                    "Wind" beginnen.
                </p>
                </p>
            </template>

        </UCard>
    </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false);
</script>