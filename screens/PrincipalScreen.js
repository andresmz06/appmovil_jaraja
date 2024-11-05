// screens/PrincipalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ScrollView, RefreshControl } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import appFirebase from '../credenciales';

const db = getFirestore(appFirebase);

const PrincipalScreen = () => {
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDatos = async () => {
    const querySnapshot = await getDocs(collection(db, 'Finanza'));
    const datos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const ingresosFiltrados = datos.filter((item) => item.Tipo === 'Ingreso');
    const egresosFiltrados = datos.filter((item) => item.Tipo === 'Egreso');

    setIngresos(ingresosFiltrados);
    setEgresos(egresosFiltrados);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para refrescar al deslizar hacia abajo
  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  // Calcula el total de ingresos y egresos
  const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.Monto, 0);
  const totalEgresos = egresos.reduce((acc, egreso) => acc + egreso.Monto, 0);
  const total = totalIngresos + totalEgresos;

  // Calcula el presupuesto disponible
  const disponible = totalIngresos - totalEgresos;

  // Datos para el gráfico de pastel en porcentaje redondeado
  const chartData = [
    {
      name: '% Ingreso',
      monto: total ? Math.round((totalIngresos / total) * 100) : 0,
      color: '#4B0082',
      legendFontColor: '#333',
      legendFontSize: 15,
    },
    {
      name: '% Egreso',
      monto: total ? Math.round((totalEgresos / total) * 100) : 0,
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
      <Text style={styles.registroText}>{new Date(item.Fecha.seconds * 1000).toLocaleDateString()}</Text>
      <Text style={styles.registroText}>{item.nombre}</Text>
      <Text style={styles.registroText}>{item.Monto.toLocaleString()} Gs.</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Text style={styles.headerLabel}>Ingreso</Text>
          <Text style={styles.ingresoText}>${totalIngresos.toLocaleString()}</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerLabel}>Egreso</Text>
          <Text style={styles.egresoText}>${totalEgresos.toLocaleString()}</Text>
        </View>
      </View>
      
      <View style={styles.availableContainer}>
        <Text style={styles.availableAmount}>{disponible.toLocaleString()} Gs.</Text>
        <Text style={styles.availableText}>Disponible</Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 60}
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

        <Text style={styles.tableTitle}>Ultimos Movimientos</Text>
        <FlatList
          data={registros}
          renderItem={renderRegistro}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          scrollEnabled={false} // Deshabilita el desplazamiento en FlatList
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  headerItem: {
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
  },
  ingresoText: {
    color: '#50C878',
    fontSize: 18,
    fontWeight: 'bold',
  },
  egresoText: {
    color: '#FF7F7F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  availableContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  availableText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A9A9A9',
    marginLeft: 10,
  },
  availableAmount: {
    fontSize: 20,
    color: '#50C878',
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginTop: 20,
    textAlign: 'center',
  },
  registroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  registroText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  flatList: {
    marginTop: 10,
  },
});

export default PrincipalScreen;
