import seedrandom from 'seedrandom'
import { fetchAllPresets, fetchRegistries } from '../../services/DataFetcher.js'
import type { VersionId } from '../../services/Versions.js'
import { checkVersion } from '../../services/Versions.js'

export async function generateRandomizer(version: VersionId, seed: string, randomizeBlocks: boolean, randomizeEntities: boolean, excludeNonSurvival: boolean): Promise<Record<string, any>> {
	const [lootTables, registries] = await Promise.all([
		fetchAllPresets(version, 'loot_table'),
		fetchRegistries(version),
	])

	let items = (registries.get('item') ?? registries.get('minecraft:item') ?? []).filter(id => id !== 'minecraft:air')
	if (items.length === 0) {
		throw new Error('No items found for this version')
	}

	if (excludeNonSurvival) {
		items = items.filter(id => {
			if (id.endsWith('_spawn_egg')) return false
			if (NON_SURVIVAL_ITEMS.has(id)) return false
			return true
		})
	}

	const rng = seedrandom(seed)

	const result: Record<string, any> = {}
	const lootTableEntries = [...lootTables.entries()]

	const folder = checkVersion(version, '1.21') ? 'loot_table' : 'loot_tables'

	for (const [id, _] of lootTableEntries) {
		const isBlock = id.startsWith('blocks/')
		const isEntity = id.startsWith('entities/')

		if ((isBlock && randomizeBlocks) || (isEntity && randomizeEntities)) {
			const randomItem = items[Math.floor(rng() * items.length)]
			result[`data/minecraft/${folder}/${id}.json`] = {
				type: isBlock ? 'minecraft:block' : 'minecraft:entity',
				pools: [
					{
						rolls: 1,
						entries: [
							{
								type: 'minecraft:item',
								name: randomItem,
								functions: [
									{
										function: 'minecraft:set_count',
										count: 1,
									},
								],
							},
						],
					},
				],
			}
		}
	}

	return result
}

const NON_SURVIVAL_ITEMS = new Set([
	'minecraft:air',
	'minecraft:barrier',
	'minecraft:structure_void',
	'minecraft:structure_block',
	'minecraft:command_block',
	'minecraft:chain_command_block',
	'minecraft:repeating_command_block',
	'minecraft:command_block_minecart',
	'minecraft:jigsaw',
	'minecraft:debug_stick',
	'minecraft:light',
	'minecraft:knowledge_book',
	'minecraft:spawner',
	'minecraft:reinforced_deepslate',
	'minecraft:end_portal_frame',
	'minecraft:petrified_oak_slab',
	'minecraft:bedrock',
])
