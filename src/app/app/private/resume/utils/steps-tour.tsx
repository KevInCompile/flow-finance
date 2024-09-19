import Joyride, { Step } from 'react-joyride'

const steps: Step[] = [
  {
    target: '.saldo-total',
    content:
      'Here you can see the total balance of your accounts. Select an account to view its specific balance.',
    disableBeacon: true,
  },
  {
    target: '.grafico',
    content:
      "This graph shows your daily expenses for the current month. You can navigate between months using the 'Previous' and 'Next' buttons.",
  },
  {
    target: '.movimientos',
    content:
      'Here you can see a summary of your expenses and income for the current month. Click on an expense to see more details.',
  },
]

export default function Tour({ runTour }: { runTour: boolean }) {
  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          primaryColor: '#A854F7',
        },
      }}
    />
  )
}
