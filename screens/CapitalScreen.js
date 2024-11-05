// screens/CapitalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native'; // Asegúrate de que Button esté importado
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, getDocs, doc } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

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

  useEffect(() => {
    const cargarIngresos = async () => {
      const querySnapshot = await getDocs(collection(db, 'Finanza'));
      const datos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const ingresosFiltrados = datos.filter((item) => item.Tipo === 'Ingreso');
      setIngresos(ingresosFiltrados);
    };
    cargarIngresos();
  }, []);

  useEffect(() => {
    const total = ingresos.reduce((acc, ingreso) => acc + ingreso.Monto, 0);
    setTotalIngresos(total);
  }, [ingresos]);

  const agregarIngreso = async () => {
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
      nombre: nombreIngreso,
      Monto: numericMonto,
      Fecha: fechaIngreso,
      Tipo: 'Ingreso',
    };

    if (editandoIngreso) {
      await updateDoc(doc(db, 'Finanza', editandoIngreso.id), nuevoIngreso);
      setIngresos(ingresos.map((ingreso) => (ingreso.id === editandoIngreso.id ? { id: editandoIngreso.id, ...nuevoIngreso } : ingreso)));
      setEditandoIngreso(null);
    } else {
      const docRef = await addDoc(collection(db, 'Finanza'), nuevoIngreso);
      setIngresos([...ingresos, { id: docRef.id, ...nuevoIngreso }]);
    }

    setNombreIngreso('');
    setMontoIngreso('');
    setFechaTexto('');
    setModalVisible(false);
  };

  const eliminarIngreso = async (id) => {
    await deleteDoc(doc(db, 'Finanza', id));
    setIngresos(ingresos.filter((ingreso) => ingreso.id !== id));
  };

  const editarIngreso = (ingreso) => {
    setNombreIngreso(ingreso.nombre);
    setMontoIngreso(ingreso.Monto.toString());
    setFechaTexto(new Date(ingreso.Fecha.seconds * 1000).toLocaleDateString());
    setEditandoIngreso(ingreso);
    setModalVisible(true);
  };

  const renderIngreso = ({ item }) => (
    <View style={styles.ingresoRow}>
      <Text style={styles.ingresoText}>{item.nombre}</Text>
      <Text style={styles.ingresoText}>{item.Monto.toLocaleString()} Gs.</Text>
      <Text style={styles.ingresoText}>{new Date(item.Fecha.seconds * 1000).toLocaleDateString()}</Text>
      <View style={styles.iconButtons}>
        <TouchableOpacity onPress={() => editarIngreso(item)}>
          <MaterialIcons name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarIngreso(item.id)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
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
    backgroundColor: '#8A2BE2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
  },
  capitalCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#006400',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
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
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  ingresoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  ingresoText: {
    fontSize: 16,
    color: '#000',
  },
  iconButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
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
