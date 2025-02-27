import { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  Chip,
  IconButton,
  Menu,
  DataTable,
  Searchbar,
  useTheme,
  Card,
  Dialog,
  Text,
  Modal,
  Portal,
  Button,
  Avatar,
  Divider,
  List,
} from "react-native-paper";
import { useCustomer } from "../context/CustomerProvider";
import { pathPhotos } from "../api/axios";
import { checkExpiration } from "../helpers/date";

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
  const [activeDialog, setShowDialog] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { iWantRemoveCustomer, customers, fetchCustomers } = useCustomer();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const hideDialog = () => setShowDialog(false);
  const showDialog = () => setShowDialog(true);

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

  const CardItem = ({ item: customer, index }) => {
    const { expired, remainingTime, elapsedAfterExpiration, lastDay } =
      checkExpiration(customer.endingDate);

    return (
      <Card
        mode="contained"
        style={{
          marginBottom: 7,
          backgroundColor: theme.colors.background2,
          borderRightColor: expired
            ? theme.colors.error
            : lastDay
              ? theme.colors.warning
              : theme.colors.success,
          borderRightWidth: 3,
        }}
      >
        <Card.Title
          title={`${customer.names} ${customer.lastnames}`}
          subtitle={
            customer.amount >= customer.planCost ? (
              <Text style={{ color: theme.colors.success }}>Pagado</Text>
            ) : (
              <Text style={{ color: theme.colors.warning }}>
                Pago pendiente
              </Text>
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
          right={() => (
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
                onPress={() => {
                  showDialog(), closeMenu(index);
                  setCustomer(customer);
                }}
              />
              <Divider />
              <Menu.Item
                leadingIcon="eye"
                title="Ver"
                onPress={() => {
                  showModal();
                  closeMenu(index);
                  setCustomer({
                    ...customer,
                    remainingTime,
                    elapsedAfterExpiration,
                  });
                }}
              />
            </Menu>
          )}
        />
      </Card>
    );
  };

  const filteredData = customers.filter((item) =>
    Object.values(item).some((value) =>
      String(value)
        .toLowerCase()
        .trim()
        .includes(searchQuery.toLowerCase().trim()),
    ),
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
    <View style={{ position: "relative", height: "100%" }}>
      <Portal>
        <Dialog
          visible={activeDialog}
          onDismiss={hideDialog}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>Eliminar cliente</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">¿Desea eliminar al cliente?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button
              mode="contained"
              onPress={() => {
                iWantRemoveCustomer(customer);
                hideDialog();
              }}
            >
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Card.Title
            title={`${customer.names} ${customer.lastnames}`}
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
          <Text variant="titleMedium">Duración</Text>
          <View style={{ marginLeft: 10 }}>
            <Text variant="bodyMedium">
              {customer.duration} días (
              {customer.remainingTime || customer.elapsedAfterExpiration})
            </Text>
            <Text variant="bodyMedium">{customer.startDate} (Inicio)</Text>
            <Text variant="bodyMedium">
              {customer.endingDate} (Finalización)
            </Text>
          </View>

          <Text variant="titleMedium">Descripción</Text>

          <View style={{ marginLeft: 10 }}>
            {customer.description && (
              <Text variant="bodyMedium">{customer.description}</Text>
            )}
            <Text variant="bodyMedium" style={{ color: theme.colors.success }}>
              Dinero cancelado de ${customer.amount}
            </Text>
            {customer.amount < customer.planCost && (
              <Text style={{ color: theme.colors.warning }}>
                Pago pendientede ${customer.planCost - customer.amount}
              </Text>
            )}
          </View>
        </Modal>
      </Portal>

      <Searchbar
        placeholder="Buscar"
        onChangeText={(t) => {
          setSearchQuery(t);
          setPage(0);
        }}
        value={searchQuery}
        style={{ marginHorizontal: 10 }}
      />

      <Button
        icon="account-plus"
        style={{ margin: 6 }}
        onPress={() => navigation.navigate("FormCustomer")}
      >
        Añadir cliente
      </Button>

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

      <FlatList
        style={{ marginHorizontal: 10 }}
        data={filteredData.slice(from, to)}
        renderItem={CardItem}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.dni}
      />
    </View>
  );
};

export default CustomerList;
