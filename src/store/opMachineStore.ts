
import { create } from 'zustand'
import opMachine1 from '../data/operation-machines/operation-machine-1.json'
import { OperationMachine } from '../types/operation-machine.types'
import { combine } from 'zustand/middleware'

export const useOpMachineStore = create(combine({ opMachine: opMachine1 as OperationMachine }, (set) => ({
    updateOpMachine: (newOpMachine: OperationMachine) => set({ opMachine: newOpMachine }),
})))