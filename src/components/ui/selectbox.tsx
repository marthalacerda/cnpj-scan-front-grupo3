import {
  Badge,
  Combobox,
  Portal,
  Wrap,
  createListCollection,
  Text
} from "@chakra-ui/react"
import { useMemo, useState, FC } from "react"

// Interface para as Props
interface SelectBoxProps {

  // A lista de todos os campos disponíveis
  availableFields: string[];

  // O estado atual da seleção
  selectedFields: string[];

  // A função para atualizar o estado
  onFieldsChange: (fields: string[]) => void;

  // Mapeamento de nome técnico para nome amigável
  fieldMapping: Record<string, string>;

}


const SelectBox: FC<SelectBoxProps> = ({ availableFields: avaiableFields, selectedFields, onFieldsChange, fieldMapping }) => {

  const [searchValue, setSearchValue] = useState("")
  
  // O estado local substituído por selectedFields
  // const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const filteredItems = useMemo(
    () =>
      avaiableFields.filter((item) =>

        // Filtra usando o nome amigável para a busca
        fieldMapping[item].toLowerCase().includes(searchValue.toLowerCase()),
      
      ),
    [searchValue, avaiableFields, fieldMapping],
  )

  // O collection é criado a partir dos nomes técnicos
  const collection = useMemo(
    () => createListCollection({ items: filteredItems }),
    [filteredItems],
  )

  const handleValueChange = (details: Combobox.ValueChangeDetails) => {
    
    // Passamos a lista de campos selecionados para o componente pai
    onFieldsChange(details.value)
  }

  const isSelectionEmpty = selectedFields.length === 0;

  return (
    <Combobox.Root
      multiple
      closeOnSelect
      width="320px"
      value={selectedFields}
      collection={collection}
      onValueChange={handleValueChange}
      onInputValueChange={(details) => setSearchValue(details.inputValue)}
    >
      <Wrap gap="2">
        {selectedFields.map((fieldKey) => (
          <Badge key={fieldKey}>{fieldMapping[fieldKey]}</Badge>
        ))}
      </Wrap>

      <Combobox.Label>Selecione os campos para montar sua tabela :</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input
          placeholder={isSelectionEmpty? "Todos (padrão)" : "Adicionar campos.."}/>
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content color='#036DC5'>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel></Combobox.ItemGroupLabel>
              {filteredItems.map((item) => (
                <Combobox.Item key={item} item={item}>
                  {fieldMapping[item]}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
              <Combobox.Empty>Todos</Combobox.Empty>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}


export default SelectBox;