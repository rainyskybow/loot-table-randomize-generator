import { useCallback, useRef, useState } from 'preact/hooks'
import config from '../../Config.js'
import { useLocale, useVersion } from '../../contexts/index.js'
import { stringifySource } from '../../services/Source.js'
import { hexId, writeZip } from '../../Utils.js'
import { Btn } from '../Btn.jsx'
import { ErrorPanel } from '../ErrorPanel.jsx'
import { Octicon } from '../Octicon.jsx'
import { VersionSwitcher } from '../VersionSwitcher.js'
import { generateRandomizer } from './RandomizerGenerator.js'

export function RandomizerPanel() {
	const { locale } = useLocale()
	const { version, changeVersion } = useVersion()

	const [seed, setSeed] = useState(hexId())
	const [randomizeBlocks, setRandomizeBlocks] = useState(true)
	const [randomizeEntities, setRandomizeEntities] = useState(true)
	const [excludeNonSurvival, setExcludeNonSurvival] = useState(true)

	const download = useRef<HTMLAnchorElement>(null)
	const [error, setError] = useState<Error | string | null>(null)
	const [hasDownloaded, setHasDownloaded] = useState(false)

	const generate = useCallback(async () => {
		if (!download.current) return
		try {
			const pack = await generateRandomizer(version, seed, randomizeBlocks, randomizeEntities, excludeNonSurvival)
			const entries = Object.entries(pack).map(([path, data]) => {
				const text = stringifySource(JSON.stringify(data, null, 2), 'json')
				return [path, new TextEncoder().encode(text)] as [string, Uint8Array]
			})
			const pack_format = config.versions.find(v => v.id === version)!.pack_format
			const packMcmeta = {
				pack: {
					pack_format,
					description: 'Randomized loot tables from misode.github.io',
					...(pack_format > 81 ? { min_format: pack_format, max_format: pack_format } : {}),
				},
			}
			const packMcmetaText = stringifySource(JSON.stringify(packMcmeta, null, 2), 'json')
			entries.push(['pack.mcmeta', new TextEncoder().encode(packMcmetaText)])
			const url = await writeZip(entries)
			download.current.setAttribute('href', url)
			download.current.setAttribute('download', 'randomizer.zip')
			download.current.click()
			setHasDownloaded(true)
			setError(null)
		} catch (e) {
			if (e instanceof Error) {
				e.message = `Something went wrong creating the randomizer pack: ${e.message}`
				setError(e)
			}
		}
	}, [version, seed, randomizeBlocks, randomizeEntities, excludeNonSurvival])

	return <>
		<div class="customized-tab">
			<div class="customized-input">
				<label>{locale('versions.minecraft_versions')}</label>
				<VersionSwitcher value={version} onChange={changeVersion} />
			</div>
			<div class="customized-input">
				<label>{locale('randomizer.seed')}</label>
				<div class="btn-input">
					<input type="text" value={seed} onInput={e => setSeed((e.target as HTMLInputElement).value)} />
					<Btn icon="sync" tooltip="Generate new seed" onClick={() => setSeed(hexId())} />
				</div>
			</div>
			<div class="customized-input">
				<label>
					<input type="checkbox" checked={randomizeBlocks} onChange={e => setRandomizeBlocks((e.target as HTMLInputElement).checked)} />
					{locale('randomizer.blocks')}
				</label>
			</div>
			<div class="customized-input">
				<label>
					<input type="checkbox" checked={randomizeEntities} onChange={e => setRandomizeEntities((e.target as HTMLInputElement).checked)} />
					{locale('randomizer.entities')}
				</label>
			</div>
			<div class="customized-input">
				<label>
					<input type="checkbox" checked={excludeNonSurvival} onChange={e => setExcludeNonSurvival((e.target as HTMLInputElement).checked)} />
					{locale('randomizer.exclude_non_survival')}
				</label>
			</div>
		</div>
		<div class="customized-actions">
			<Btn icon="download" label="Create" class="customized-create" tooltip="Create and download data pack" tooltipLoc="se" onClick={generate} />
			<a ref={download} style="display: none;"></a>
		</div>
		{error && <ErrorPanel error={error} onDismiss={() => setError(null)} />}
		{hasDownloaded && <div class="customized-instructions">
			<h4>
				{Octicon.mortar_board}
				{locale('project.what_now')}
			</h4>
			<ol>
				<li>{locale('randomizer.instructions.1')}</li>
				<li>{locale('randomizer.instructions.2')}</li>
				<li>{locale('randomizer.instructions.3')}</li>
				<li>{locale('randomizer.instructions.4')}</li>
			</ol>
		</div>}
	</>
}
