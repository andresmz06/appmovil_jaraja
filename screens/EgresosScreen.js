// screens/EgresosScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, getDocs, doc } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const EgresosScreen = () => {
  const [egresos, setEgresos] = useState([]);
  const [nombreEgreso, setNombreEgreso] = useState('');
  const [montoEgreso, setMontoEgreso] = useState('');
  const [fechaEgreso, setFechaEgreso] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [totalEgresos, setTotalEgresos] = useState(0);
  const [editandoEgreso, setEditandoEgreso] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fechaTexto, setFechaTexto] = useState('');

  // Leer datos de Firebase al iniciar
  useEffect(() => {
    const cargarEgresos = async () => {
      const querySnapshot = await getDocs(collection(db, 'Finanza'));
      const datos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const egresosFiltrados = datos.filter((item) => item.Tipo === 'Egreso');
      setEgresos(egresosFiltrados);
    };
    cargarEgresos();
  }, []);

  useEffect(() => {
    const total = egresos.reduce((acc, egreso) => acc + egreso.Monto, 0);
    setTotalEgresos(total);
  }, [egresos]);

  const agregarEgreso = async () => {
    if (!nombreEgreso || !montoEgreso || !fechaTexto) {
      Alert.alert('Error', 'Debe completar todos los campos');
      return;
    }

    const numericMonto = parseFloat(montoEgreso.replace(/\./g, ''));
    if (isNaN(numericMonto)) {
      Alert.alert('Error', 'El monto ingresado no es válido');
      return;
    }

    const nuevoEgreso = {
      nombre: nombreEgreso,
      Monto: numericMonto,
      Fecha: fechaEgreso,
      Tipo: 'Egreso',
    };

    if (editandoEgreso) {
      await updateDoc(doc(db, 'Finanza', editandoEgreso.id), nuevoEgreso);
      setEgresos(egresos.map((egreso) => (egreso.id === editandoEgreso.id ? { id: editandoEgreso.id, ...nuevoEgreso } : egreso)));
      setEditandoEgreso(null);
    } else {
      const docRef = await addDoc(collection(db, 'Finanza'), nuevoEgreso);
      setEgresos([...egresos, { id: docRef.id, ...nuevoEgreso }]);
    }

    setNombreEgreso('');
    setMontoEgreso('');
    setFechaTexto('');
    setModalVisible(false);
  };

  const eliminarEgreso = async (id) => {
    await deleteDoc(doc(db, 'Finanza', id));
    setEgresos(egresos.filter((egreso) => egreso.id !== id));
  };

  const editarEgreso = (egreso) => {
    setNombreEgreso(egreso.nombre);
    setMontoEgreso(egreso.Monto.toString());
    setFechaTexto(new Date(egreso.Fecha.seconds * 1000).toLocaleDateString());
    setEditandoEgreso(egreso);
    setModalVisible(true);
  };

  const renderEgreso = ({ item }) => (
    <View style={styles.egresoRow}>
      <Text style={styles.egresoText}>{item.nombre}</Text>
      <Text style={styles.egresoText}>{item.Monto.toLocaleString()} Gs.</Text>
      <Text style={styles.egresoText}>{new Date(item.Fecha.seconds * 1000).toLocaleDateString()}</Text>
      <View style={styles.rowButtons}>
        <Button title="Editar" onPress={() => editarEgreso(item)} color="blue" />
        <Button title="Eliminar" onPress={() => eliminarEgreso(item.id)} color="red" />
      </View>
    </View>
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaEgreso;
    setShowDatePicker(false);
    setFechaEgreso(currentDate);
    setFechaTexto(currentDate.toLocaleDateString());
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos</Text>
      <View style={styles.expenseCircle}>
        <Text style={styles.expenseAmount}>{totalEgresos.toLocaleString()} Gs.</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Agregar Egreso</Text>
      </TouchableOpacity>
      
      <FlatList
        data={egresos}
        renderItem={renderEgreso}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.tableHeader}>Lista de Egresos</Text>}
      />

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editandoEgreso ? 'EDITAR EGRESO' : 'INGRESAR EGRESO'}</Text>
          <TextInput
            placeholder="Nombre de egreso"
            value={nombreEgreso}
            onChangeText={setNombreEgreso}
            style={styles.input}
          />
          <TextInput
            placeholder="Monto en Gs."
            value={montoEgreso}
            onChangeText={setMontoEgreso}
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
              value={fechaEgreso}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <View style={styles.modalButtons}>
            <Button title="Guardar" onPress={agregarEgreso} color="blue" />
            <Button title="Cancelar" onPress={() => { setModalVisible(false); setEditandoEgreso(null); }} color="red" />
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
  expenseCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#B22222', // Rojo oscuro para el contorno
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  expenseAmount: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FF7F7F', // Rojo claro para el fondo del botón
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
  egresoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  egresoText: {
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

export default EgresosScreen;
