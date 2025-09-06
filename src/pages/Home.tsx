import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { token, logout, user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!token) return;

      try {
        const response = await api.get(
          "/report/details/61ee05a4-ba59-46b6-bd85-550031bfd1bf",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              companyid: "791a11fb-e81d-40be-8269-2e0d888419db",
            },
            params: {
              operation: "Entradas",
              page: 1,
              limit: 10,
              classification: "114301 - PECAS  TOYOTA CBU",
            },
          }
        );

        console.log("Report data:", response.data);

        // Se a API retornar um objeto único, transformamos em array
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setReports(data);
      } catch (err) {
        console.error("Erro ao buscar relatório:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [token]);

  const handleLogout = () => {
    logout();
  };

  if (loading) return <p>Carregando relatório...</p>;
  if (error) return <p>{error}</p>;

  // Definir colunas com base nas chaves do primeiro item
  const columns = reports.length > 0 ? Object.keys(reports[0]) : [];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bem-vindo, {user?.username}!</h1>

      {reports.length > 0 ? (
        <table className="report-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col}>{String(report[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum relatório encontrado.</p>
      )}

      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Sair
      </button>
    </div>
  );
}



