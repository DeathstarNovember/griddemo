import React, { useState } from 'react'

type Box = { name: string; gridArea: string }

type Item = { name: string; color: string }

/**
 * Gets a random color code.
 * @returns a random hexdecimal color code
 */
export const getRandomColor = () => {
  // list all hex characters in a string
  const letters = '0123456789ABCDEF'

  // Set up a string with the leading '#'
  let color: string = '#'

  // Assign the letters one-by-one until all 6 are assigned
  for (let i = 0; i < 6; i++) {
    // Get 6 randomly-selected character from the letters string
    color += letters[Math.floor(Math.random() * 16)]
  }

  return color
}

const getContrast = (hexcolor: string) => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1)
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split('')
      .map(function (hex) {
        return hex + hex
      })
      .join('')
  }

  // Convert to RGB value
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)

  // Get YIQ ratio
  const yiqRatio = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast.
  // YIQ at or above 128 is bright, and contrasts with black
  // YIQ below 128 is dark, and contrasts with white
  return yiqRatio >= 128 ? 'black' : 'white'
}

const buttonColor = getRandomColor()

const useSelectedItems = (initialSelectedItems: Item[] = []) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    initialSelectedItems,
  )

  const selectedColors = selectedItems.map((i) => i.color)

  const addSelectedItem = (item: Item) => {
    if (selectedColors.includes(item.color)) return
    setSelectedItems([...selectedItems, item])
  }

  const removeSelectedItem = (item: Item) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => {
        return selectedItem.color !== item.color
      }),
    )
  }

  return { selectedItems, addSelectedItem, removeSelectedItem }
}

const boxes: Box[] = [
  { name: 'Color List 1', gridArea: 'leftTop' },
  { name: 'Color List 2', gridArea: 'leftBottom' },
  { name: 'Selected Colors', gridArea: 'right' },
]

const App = () => {
  const {
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
  } = useSelectedItems([])

  return (
    <Layout>
      <div
        style={{
          display: 'grid',
          gap: 10,
          gridTemplateColumns: '1fr 3fr',
          gridTemplateRows: '1fr 1fr',
          gridTemplateAreas: `'leftTop    right' 
                              'leftBottom right'`,
          height: '80vw',
          width: '80vw',
          backgroundColor: '#acacac',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <List
          box={boxes[0]}
          listItems={[]}
          onItemClick={() => {}}
          buttonLabel=""
        />
        <List
          box={boxes[1]}
          listItems={[]}
          onItemClick={() => {}}
          buttonLabel=""
        />
        <List
          box={boxes[2]}
          listItems={[]}
          onItemClick={() => {}}
          buttonLabel=""
        />
      </div>
    </Layout>
  )
}

export default App

const Layout: React.FC = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#fff',
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  )
}

const List = ({
  box,
  listItems,
  buttonLabel,
  onItemClick,
}: {
  box?: Box
  listItems: Item[]
  buttonLabel: string
  onItemClick: (item: Item) => void
}) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        gridArea: box?.gridArea,
        display: 'grid',
        gridTemplateRows: `35px repeat(${listItems.length}, 50px)`,
        gap: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        {box?.name}
      </div>
      {listItems.map((listItem) => (
        <div
          style={{
            color: getContrast(listItem.color),
            textAlign: 'center',
            backgroundColor: listItem.color,
            borderRadius: 10,
            display: 'grid',
            gridTemplateColumns: '4fr 1fr',
            alignItems: 'center',
            padding: '5px 10px',
          }}
        >
          <div>{listItem.color}</div>
          <button
            style={{
              height: '80%',
              borderRadius: 10,
              backgroundColor: buttonColor,
              border: 'none',
              color: getContrast(buttonColor),
            }}
            onClick={() => onItemClick(listItem)}
          >
            {buttonLabel}
          </button>
        </div>
      ))}
    </div>
  )
}
