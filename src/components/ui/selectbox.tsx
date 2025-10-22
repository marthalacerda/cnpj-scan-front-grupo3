import {
  Badge,
  Combobox,
  Portal,
  Wrap,
  createListCollection,
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


// Essa lista vai vir das props
// const campos = [
//   "Nome",
//   "CNPJ",
//   "CEP",
//   "Logradouro",
//   "Numero",
//   "Complemento",
//   "Bairro",
//   "Municipio",
//   "UF",
//   "Telefone",
//   "Situação",
// ]



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

          // Exibe o nome amigável nas tags
          <Badge key={fieldKey}>{fieldMapping[fieldKey]}</Badge>
        ))}
      </Wrap>

      <Combobox.Label>Selecione os dados que deseja converter :</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content color='black'>
            <Combobox.ItemGroup>
              <Combobox.ItemGroupLabel>Campos</Combobox.ItemGroupLabel>
              {filteredItems.map((item) => (
                <Combobox.Item key={item} item={item}>
                  {fieldMapping[item]}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
              <Combobox.Empty>Não Encontrado</Combobox.Empty>
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}


export default SelectBox;