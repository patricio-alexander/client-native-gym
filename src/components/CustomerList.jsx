import { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  IconButton,
  Menu,
  DataTable,
  Searchbar,
  useTheme,
  Card,
  Text,
  Modal,
  Portal,
  Button,
  Avatar,
  Divider,
  List,
  Icon,
} from "react-native-paper";
import { useCustomer } from "../context/CustomerProvider";
import { pathPhotos } from "../api/axios";

const CustomerList = () => {
  const theme = useTheme();
  const containerStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 20,
    margin: 10,
  };
  const navigation = useNavigation();
  const [visibleMenus, setVisibleMenus] = useState([]);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [customer, setCustomer] = useState({});

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { iWantRemoveCustomer, customers, fetchCustomers, currentPrice } =
    useCustomer();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const openMenu = (index) => {
    const newVisibleMenus = [...visibleMenus];
    newVisibleMenus[index] = true;
    setVisibleMenus(newVisibleMenus);
  };

  const closeMenu = (index) => {
    const newVisibleMenus = [...visibleMenus];
    newVisibleMenus[index] = false;
    setVisibleMenus(newVisibleMenus);
  };

  const filteredData = customers.filter((item) =>
    Object.values(item).some((value) =>
      String(value)
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase().trim())
    )
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, filteredData.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    setVisibleMenus(Array(customers.length).fill(false));
  }, [customers.length]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Card>
            <Card.Title
              title={customer.fullname}
              subtitle={customer.dni}
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={
                    customer.photo
                      ? { uri: `${pathPhotos}/${customer.photo}` }
                      : require("../../assets/noImage.png")
                  }
                />
              )}
              // right={(props) => ()}
            />
            <Card.Content>
              <Text variant="bodyMedium">
                Duración {customer.duration} días
              </Text>
              <Text variant="bodyMedium">Inicio: {customer.startDate}</Text>
              <Text variant="bodyMedium">Fin: {customer.endingDate}</Text>
              <Text style={{ color: theme.colors.success }}>
                Pagó ${customer.amount}
              </Text>
              {customer.amount < currentPrice && (
                <Text style={{ color: theme.colors.warning }}>
                  Debe ${currentPrice - customer.amount}
                </Text>
              )}
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      <Searchbar
        placeholder="Buscar"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ margin: 10 }}
      />

      <Button
        icon="account-plus"
        style={{ margin: 6 }}
        onPress={() => navigation.navigate("FormCustomer")}
      >
        Añadir cliente
      </Button>
      <List.Section style={{ margin: 10 }}>
        <List.Subheader style={{ color: theme.colors.success }}>
          <Icon source="cash-multiple" color={theme.colors.success} size={20} />{" "}
          ${currentPrice}
        </List.Subheader>
        <List.Subheader>Clientes</List.Subheader>
        <ScrollView style={{ maxHeight: 400 }}>
          {filteredData.slice(from, to).map((customer, index) => (
            <Card.Title
              key={index}
              title={customer.fullname}
              subtitle={
                customer.amount >= currentPrice ? (
                  <Text style={{ color: theme.colors.success }}>Pagado</Text>
                ) : (
                  <Text style={{ color: theme.colors.warning }}>Debe</Text>
                )
              }
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={
                    customer.photo
                      ? { uri: `${pathPhotos}/${customer.photo}` }
                      : require("../../assets/noImage.png")
                  }
                />
              )}
              right={(props) => (
                <Menu
                  visible={visibleMenus[index]}
                  onDismiss={() => closeMenu(index)}
                  anchor={
                    <IconButton
                      icon="dots-horizontal"
                      size={20}
                      onPress={() => openMenu(index)}
                    />
                  }
                >
                  <Menu.Item
                    leadingIcon="pencil"
                    title="Editar"
                    onPress={() => {
                      navigation.navigate("FormCustomer", {
                        customerId: customer.customerId,
                      });
                      closeMenu(index);
                    }}
                  />
                  <Menu.Item
                    leadingIcon="delete"
                    title="Eliminar"
                    onPress={() => iWantRemoveCustomer(customer)}
                  />
                  <Divider />
                  <Menu.Item
                    leadingIcon="eye"
                    title="Ver"
                    onPress={() => {
                      showModal();
                      closeMenu(index);
                      setCustomer(customer);
                    }}
                  />
                </Menu>
              )}
            />
          ))}
        </ScrollView>

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={setPage}
          label={`${from + 1}-${to} de ${filteredData.length}`}
          numberOfItemsPerPageList={[5, 10, 15, 20]} // Opciones de cantidad de elementos por página
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);

            setPage(0); // Reiniciar la página a 0 al cambiar la cantidad de elementos por página
          }}
          showFastPaginationControls
          selectPageDropdownLabel={"Filas por página"}
        />
      </List.Section>
    </View>
  );
};

export default CustomerList;
