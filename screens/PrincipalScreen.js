// screens/PrincipalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const PrincipalScreen = () => {
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [contornoColor, setContornoColor] = useState('#006400'); // Verde oscuro predeterminado

  useEffect(() => {
    const cargarDatos = async () => {
      const querySnapshot = await getDocs(collection(db, 'Finanza'));
      const datos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      const ingresosFiltrados = datos.filter((item) => item.Tipo === 'Ingreso');
      const egresosFiltrados = datos.filter((item) => item.Tipo === 'Egreso');

      console.log("Ingresos:", ingresosFiltrados); // Verificar los ingresos
      console.log("Egresos:", egresosFiltrados);   // Verificar los egresos

      setIngresos(ingresosFiltrados);
      setEgresos(egresosFiltrados);
    };
    
    cargarDatos();
  }, []);

  // Calcula el total de ingresos y egresos
  const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.Monto, 0);
  const totalEgresos = egresos.reduce((acc, egreso) => acc + egreso.Monto, 0);

  // Actualiza el presupuesto total y el color del contorno del círculo
  useEffect(() => {
    const resultado = totalIngresos - totalEgresos;
    setPresupuestoTotal(resultado);
    setContornoColor(resultado >= 0 ? '#006400' : '#B22222'); // Verde si es positivo, rojo si es negativo
  }, [totalIngresos, totalEgresos]);

  // Datos para el gráfico de pastel
  const chartData = [
    {
      name: 'Presupuesto',
      monto: totalIngresos,
      color: '#50C878',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: 'Gastos',
      monto: totalEgresos,
      color: '#FF7F7F',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
  ];

  // Fusión de ingresos y egresos para la tabla de registros
  const registros = [
    ...ingresos.map((ingreso) => ({ ...ingreso, tipo: 'Ingreso' })),
    ...egresos.map((egreso) => ({ ...egreso, tipo: 'Egreso' })),
  ];

  const renderRegistro = ({ item }) => (
    <View style={styles.registroRow}>
      <Text style={styles.registroText}>{item.nombre}</Text>
      <Text style={styles.registroText}>{item.tipo}</Text>
      <Text style={styles.registroText}>{item.Monto.toLocaleString()} Gs.</Text>
      <Text style={styles.registroText}>{new Date(item.Fecha.seconds * 1000).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Presupuesto Total</Text>
      <View style={[styles.budgetCircle, { borderColor: contornoColor }]}>
        <Text style={styles.budgetAmount}>{presupuestoTotal.toLocaleString()} Gs.</Text>
      </View>

      <Text style={styles.chartTitle}>Distribución de Presupuesto y Gastos</Text>
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#FFF',
          backgroundGradientFrom: '#FFF',
          backgroundGradientTo: '#FFF',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="monto"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={styles.tableTitle}>Lista de Ingresos y Egresos</Text>
      <FlatList
        data={registros}
        renderItem={renderRegistro}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Nombre</Text>
            <Text style={styles.headerText}>Tipo</Text>
            <Text style={styles.headerText}>Monto</Text>
            <Text style={styles.headerText}>Fecha</Text>
          </View>
        }
      />
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
  budgetCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  budgetAmount: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  registroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  registroText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f1f1f1',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});

export default PrincipalScreen;
