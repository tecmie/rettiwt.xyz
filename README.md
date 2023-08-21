# xims


## Resources
- <https://github.com/iway1/trpc-panel>
- <https://trpc.io/docs/client/nextjs/server-side-helpers> Prefetching a Query from the Server before the Client Renders

## How do I deploy this?

- Deploy on AWS: Setup with <https://github.com/porter-dev/porter>
- Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.



```md

nwá afò ✦ Studio @tecmie ✦ chatkjv.vzy.io @chatkjv ✦ Alum @MESTAfrica ✦ AI hacker 🍒 prev @kpilens #sendboxng
å
sometimes I'm petty

https://peerlist.io/0xalzzy

```


```tsx

// DateComponent.tsx
import * as React from 'react'
import { differenceInSeconds, isSameYear, isToday } from 'date-fns'
import {
  FormattedDate,
  FormattedMessage,
  FormattedRelativeTime,
  FormattedTime
} from 'react-intl'

export interface RelativeTimeProps {
  date: Date
  numeric?: 'auto' | 'always'
  style?: 'long' | 'short' | 'narrow'
}

export const RelativeTime: React.FC<RelativeTimeProps> = (props) => {
  const { date, numeric = 'auto', style = 'short' } = props

  const diff = React.useMemo(
    () => differenceInSeconds(new Date(date), new Date()),
    [props.date]
  )

  if (diff < 0 && diff > -60) {
    return <FormattedMessage id='timeAgo' defaultMessage='Just now' />
  }

  return (
    <>
      <FormattedRelativeTime
        value={diff}
        updateIntervalInSeconds={60}
        style={style}
        numeric={numeric}
      />
    </>
  )
}

export interface DateTimeProps {
  date: Date
  style?: 'long' | 'short' | 'narrow'
}

export const DateTime: React.FC<DateTimeProps> = (props) => {
  const { date, style = 'long' } = props

  const now = new Date()

  const isLong = style === 'long'
  const sameDay = isToday(date)
  const sameYear = isSameYear(date, now)

  let year: 'numeric' | undefined = undefined
  if (!sameYear) {
    year = 'numeric'
  }

  const formattedDate =
    isLong || (!isLong && !sameDay) ? (
      <FormattedDate value={date} day='numeric' month='long' year={year} />
    ) : null
  const formattedTime =
    isLong || sameDay ? <FormattedTime value={date} /> : null

  return (
    <>
      {formattedDate}
      {formattedDate && formattedTime && ', '}
      {formattedTime}
    </>
  )
}

```


## Team

- Data Scientist: 
- Frontend Engineer: 
- Backend Engineer: 
- AI Engineer: 