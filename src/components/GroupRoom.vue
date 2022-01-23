<template lang="">
    <div class='container align-items-center mt-2'>
        <div class="row">
            <div class="col-sm-1">
            
            </div>
            <div class="col-sm-11">
                <div class="card">
                    <h5 class="card-header">團體使用介面</h5>
                    <div class="card-body">
                        <Log group_mode :room_id='123'
                        v-if='true'></Log>
                        
                    </div>
                </div>
                <div class="card">
                    <h5 class="card-header">同房間其他使用者列表</h5>
                    <div class="card-body overflow-auto">
                        <table id="example" class="table table-striped table-bordered" style="width:100%">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>名稱</th>
                                    <th>情緒</th>
                                    <th>精神狀態</th>
                                    <th>正向程度</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>Tiger Nixon</td>
                                    <td>System Architect</td>
                                    <td>Edinburgh</td>
                                    <td>61</td>
                                    <td>2011/04/25</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>Garrett Winters</td>
                                    <td>Accountant</td>
                                    <td>Tokyo</td>
                                    <td>63</td>
                                    <td>2011/07/25</td>
                                </tr>
                                
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>名稱</th>
                                    <th>情緒</th>
                                    <th>精神狀態</th>
                                    <th>正向程度</th>
                                    <th>Email</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Log from './LogData.vue'
export default {
    components: {
        Log
    },
    mounted(){
        var t = $('#example').DataTable( {
            "columnDefs": [ {
                "searchable": false,
                "orderable": false,
                "targets": 0
            } ],
            "order": [[ 1, 'asc' ]]
        } );
        t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
            } );
        } ).draw();
    },

}
</script>
<style lang="">
    
</style>