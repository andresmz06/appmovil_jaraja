// screens/CapitalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const CapitalScreen = () => {
  const [ingresos, setIngresos] = useState([]);
  const [nombreIngreso, setNombreIngreso] = useState('');
  const [montoIngreso, setMontoIngreso] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [editandoIngreso, setEditandoIngreso] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fechaTexto, setFechaTexto] = useState('');

  // Calcula el total de ingresos
  useEffect(() => {
    const total = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);
    setTotalIngresos(total);
  }, [ingresos]);

  const agregarIngreso = () => {
    if (!nombreIngreso || !montoIngreso || !fechaTexto) {
      Alert.alert('Error', 'Debe completar todos los campos');
      return;
    }

    const numericMonto = parseFloat(montoIngreso.replace(/\./g, ''));
    if (isNaN(numericMonto)) {
      Alert.alert('Error', 'El monto ingresado no es válido');
      return;
    }

    const nuevoIngreso = {
      id: editandoIngreso ? editandoIngreso.id : ingresos.length.toString(),
      nombre: nombreIngreso,
      monto: numericMonto,
      fecha: fechaTexto,
    };

    if (editandoIngreso) {
      const nuevosIngresos = ingresos.map((ingreso) =>
        ingreso.id === editandoIngreso.id ? nuevoIngreso : ingreso
      );
      setIngresos(nuevosIngresos);
      setEditandoIngreso(null);
    } else {
      setIngresos([...ingresos, nuevoIngreso]);
    }

    setNombreIngreso('');
    setMontoIngreso('');
    setFechaTexto('');
    setModalVisible(false);
  };

  const eliminarIngreso = (id) => {
    setIngresos(ingresos.filter((ingreso) => ingreso.id !== id));
  };

  const editarIngreso = (ingreso) => {
    setNombreIngreso(ingreso.nombre);
    setMontoIngreso(ingreso.monto.toString());
    setFechaTexto(ingreso.fecha);
    setEditandoIngreso(ingreso);
    setModalVisible(true);
  };

  const renderIngreso = ({ item }) => (
    <View style={styles.ingresoRow}>
      <Text style={styles.ingresoText}>{item.nombre}</Text>
      <Text style={styles.ingresoText}>{item.monto.toLocaleString()} Gs.</Text>
      <Text style={styles.ingresoText}>{item.fecha}</Text>
      <View style={styles.rowButtons}>
        <Button title="Editar" onPress={() => editarIngreso(item)} color="blue" />
        <Button title="Eliminar" onPress={() => eliminarIngreso(item.id)} color="red" />
      </View>
    </View>
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaIngreso;
    setShowDatePicker(false);
    setFechaIngreso(currentDate);
    setFechaTexto(currentDate.toLocaleDateString());
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Ingresos</Text>
      <View style={styles.capitalCircle}>
        <Text style={styles.capitalAmount}>{totalIngresos.toLocaleString()} Gs.</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Ingreso</Text>
      </TouchableOpacity>
      
      <FlatList
        data={ingresos}
        renderItem={renderIngreso}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.tableHeader}>Lista de Ingresos</Text>}
      />

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editandoIngreso ? 'EDITAR INGRESO' : 'INGRESAR INGRESO'}</Text>
          <TextInput
            placeholder="Nombre de ingreso"
            value={nombreIngreso}
            onChangeText={setNombreIngreso}
            style={styles.input}
          />
          <TextInput
            placeholder="Monto en Gs."
            value={montoIngreso}
            onChangeText={setMontoIngreso}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.dateContainer}>
            <TextInput
              placeholder="Fecha (dd/mm/yyyy)"
              value={fechaTexto}
              onChangeText={setFechaTexto}
              style={styles.dateInput}
            />
            <TouchableOpacity onPress={openDatePicker}>
              <MaterialIcons name="calendar-today" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={fechaIngreso}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <View style={styles.modalButtons}>
            <Button title="Guardar" onPress={agregarIngreso} color="blue" />
            <Button title="Cancelar" onPress={() => { setModalVisible(false); setEditandoIngreso(null); }} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  capitalCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#006400',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  capitalAmount: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#50C878',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingresoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  ingresoText: {
    fontSize: 16,
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default CapitalScreen;
