import { useErrorBoundary } from 'preact/hooks'
import { ErrorPanel, Footer } from '../components/index.js'
import { RandomizerPanel } from '../components/randomizer/RandomizerPanel.jsx'
import { useLocale, useTitle } from '../contexts/index.js'

interface Props {
	path?: string,
	default?: boolean,
}
export function Randomizer({}: Props) {
	const { locale } = useLocale()
	useTitle(locale('title.randomizer'))

	const [errorBoundary, errorRetry] = useErrorBoundary()
	if (errorBoundary) {
		errorBoundary.message = `Something went wrong with the randomizer tool: ${errorBoundary.message}`
		return <main><ErrorPanel error={errorBoundary} onDismiss={errorRetry} /></main>
	}

	return <main>
		<div class="legacy-container randomizer">
			<RandomizerPanel />
		</div>
		<Footer />
	</main>
}
