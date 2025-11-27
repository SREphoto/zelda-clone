
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface WorldData {
    rooms: Record<string, RoomData>; // Key is "x,y" e.g., "7,7"
    startRoom: string;
}

export interface RoomData {
    id: string; // "x,y"
    type: 'overworld' | 'dungeon' | 'cave';
    tiles: number[][]; // 16x11 grid of tile IDs
    enemies: EnemySpawnData[];
    items: ItemSpawnData[];
    secrets?: SecretData[];
    exits?: ExitData[]; // For caves/dungeons
    doors?: DoorData[];
    events?: EventData[]; // e.g., "play sound on entry"
}

export interface DoorData {
    x: number;
    y: number;
    type: 'open' | 'locked' | 'shutter' | 'bombable';
    direction: 'up' | 'down' | 'left' | 'right';
}

export interface EnemySpawnData {
    type: string; // "octorok_red", "moblin_blue"
    x: number;
    y: number;
    count?: number; // If > 1, spawn multiple in proximity? Or just list individually.
    dropGroup?: number; // 0-9, determines item drops
}

export interface ItemSpawnData {
    type: string; // "heart", "rupee_green"
    x: number;
    y: number;
    condition?: string; // "kill_all_enemies", "push_block"
}

export interface SecretData {
    type: 'stairs' | 'cave_open';
    x: number;
    y: number;
    trigger: 'bomb' | 'burn' | 'push' | 'whistle';
    targetMap: string; // "cave_01"
    targetRoom: string; // "0,0" inside the cave map
}

export interface ExitData {
    x: number;
    y: number;
    width: number;
    height: number;
    targetMap: string;
    targetRoom: string;
    targetX: number;
    targetY: number;
}

export interface EventData {
    type: string;
    payload: any;
}
